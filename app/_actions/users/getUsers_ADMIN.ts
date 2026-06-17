'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
import {
	UnauthorizedError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Retrieves users data from the server.
 * This function is intended for use by administrators only.
 *
 * @returns A promise that resolves to the users data.
 */
export default async function getUsers_ADMIN() {
	try {
		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error.');
		}
		const supabase = createSupabaseRLSClient();

		const { data, error } = await supabase
			.from('users')
			.select('*')
			.is('deleted_at', null)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error getting users:', error);
			throw new InternalServerError('Error getting users');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
