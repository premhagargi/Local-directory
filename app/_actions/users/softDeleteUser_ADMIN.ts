'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import createSupabaseServiceClient from '@/lib/createSupabaseServiceClient';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	BadRequestError,
	UnauthorizedError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
} from '@/lib/handlingServerResponses';

/**
 * Handles the users by updating its active state in the database.
 *
 * @param usersId - The ID of the users to handle.
 * @returns A promise that resolves to the server response.
 */
export default async function softDeleteUser_ADMIN(
	userId: string
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		if (!userId) {
			throw new BadRequestError('Invalid fields to delete user.');
		}

		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error deleting user.');
		}

		const supabase = createSupabaseRLSClient();

		const { data: toBeDeleteUserData, error: toBeDeletedUserError } =
			await supabase.from('users').select('*').eq('id', userId).single();

		if (toBeDeletedUserError) {
			console.error('Error getting user:', toBeDeletedUserError);
			throw new InternalServerError('Error getting user.');
		}

		if (!toBeDeleteUserData) {
			throw new BadRequestError('User not found.');
		}

		const { error: deletedUserError } = await supabase
			.from('users')
			.update({
				is_active: false,
				deleted_at: new Date().toISOString(),
				username: userId,
				full_name: 'DELETED USER',
				avatar_url: null,
				email: 'deleted_' + userId + '@deleted.com',
				website: null,
				is_super_admin: false,
				tag_line: null,
				role: null,
				auth_id: null,
			})
			.eq('id', userId);

		if (deletedUserError) {
			console.error('Error soft deleting user:', deletedUserError);
			throw new InternalServerError('Error soft deleting user.');
		}

		if (toBeDeleteUserData.auth_id) {
			const supabaseService = createSupabaseServiceClient();

			const { error: authDeleteError } =
				await supabaseService.auth.admin.deleteUser(toBeDeleteUserData.auth_id);

			if (authDeleteError) {
				console.error('Error auth deleting user:', authDeleteError);
				throw new InternalServerError('Error auth deleting user.');
			}
		} else {
			console.error('User has no auth id.');
			throw new InternalServerError('User has no auth id.');
		}

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
