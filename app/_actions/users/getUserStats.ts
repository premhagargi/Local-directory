'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	UnauthorizedError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves user statistics.
 *
 * @returns The user statistics object containing the number of admin and non-admin users.
 */
export default async function getUserStats() {
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
			.select('is_super_admin');

		if (!data || error) {
			console.error('Error getting user stats:', error);
			throw new InternalServerError('Error getting user stats');
		}

		return handleServerSuccess({
			admin: data.filter((user) => user.is_super_admin).length,
			nonAdmin: data.filter((user) => !user.is_super_admin).length,
		});
	} catch (error) {
		return handleServerError(error, { admin: 0, nonAdmin: 0 });
	}
}
