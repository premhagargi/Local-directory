'use server';

// Import Types
import { AuthUserType } from '@/supabase-special-types';
// Import External Packages
import { redirect } from 'next/navigation';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
// Import Data
// Import Assets & Icons
// Import Error Handling
import { UnauthorizedError } from '@/lib/handlingServerResponses';

interface AuthParams {
	checkUser?: boolean;
	checkAdmin?: boolean;
	mustBeAdmin?: boolean;
	mustBeSignedIn?: boolean;
}

interface Results {
	user: AuthUserType | null;
	isSuperAdmin: boolean;
	error: any;
}

/**
 * Authenticates the user on the server-side.
 *
 * @param checkUser - Whether to check if the user exists in the database.
 * @param checkAdmin - Whether to check if the user is an admin.
 * @param mustBeAdmin - Whether the user must be an admin.
 * @param mustBeSignedIn - Whether the user must be signed in.
 * @returns An object containing the user information, admin status, and any errors.
 */
export default async function serverAuth({
	checkUser = false,
	checkAdmin = false,
	mustBeAdmin = false,
	mustBeSignedIn = false,
}: AuthParams) {
	let resultObject: Results = {
		user: null,
		isSuperAdmin: false,
		error: null,
	};

	try {
		const supabase = createSupabaseRLSClient();

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			if (mustBeSignedIn || mustBeAdmin) {
				console.error('Unauthorized Access Attempted.');
				throw new UnauthorizedError('Auth Error - unlogged or no user.');
			} else {
				resultObject = {
					user: null,
					isSuperAdmin: false,
					error: authError || 'User not authenticated',
				};
			}
		} else {
			resultObject.user = {
				id: user.id,
				email: user.email ?? null,
				is_active: true,
				role: null,
				avatar_url: null,
			};
		}

		if (user && checkUser) {
			const { data, error, status } = await supabase
				.from('users')
				.select('id, email, is_active, role, avatar_url')
				.eq('auth_id', user.id)
				.eq('is_active', true)
				.maybeSingle();

			if (error && status !== 406) {
				resultObject = {
					user: null,
					isSuperAdmin: false,
					error: authError || 'User not found',
				};
			}

			if (data) {
				resultObject.user = data;
			} else {
				throw new UnauthorizedError('Auth Error - logged but no user.');
			}
		}

		if (user && (checkAdmin || mustBeAdmin)) {
			const { data, error, status } = await supabase
				.from('users')
				.select('is_super_admin')
				.eq('auth_id', user.id)
				.eq('is_active', true)
				.maybeSingle();

			if (error && status !== 406) {
				resultObject = {
					user: null,
					isSuperAdmin: false,
					error: 'Error finding user.',
				};
			}

			resultObject.isSuperAdmin = data?.is_super_admin === true;

			if (!resultObject.isSuperAdmin && mustBeAdmin) {
				throw new UnauthorizedError('Admin Error.');
			}
		}
		return resultObject;
	} catch (error) {
		redirect('/sign-in');
	}
}
