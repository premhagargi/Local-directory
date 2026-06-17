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
 * @param newState - The new state to set for the users.
 * @returns A promise that resolves to the server response.
 */
export default async function handleUsers_ADMIN(
	usersId: string,
	newState: boolean
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		if (!usersId || newState === undefined) {
			throw new BadRequestError('Invalid fields to handle users.');
		}

		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error.');
		}

		const supabase = createSupabaseRLSClient();

		const { error } = await supabase
			.from('users')
			.update({ is_active: newState })
			.eq('id', usersId)
			.select('*')
			.maybeSingle();

		if (error) {
			console.error('Error handling users:', error);
			throw new InternalServerError('Error storing users');
		}

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
