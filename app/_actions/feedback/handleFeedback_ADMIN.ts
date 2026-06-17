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
 * Handles the feedback by updating its handled state in the database.
 *
 * @param feedbackId - The ID of the feedback to handle.
 * @param newState - The new state to set for the feedback.
 * @returns A promise that resolves to the server response.
 */
export default async function handleFeedback_ADMIN(
	feedbackId: string,
	newState: boolean
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		if (!feedbackId || newState === undefined) {
			throw new BadRequestError('Invalid fields to handle feedback.');
		}

		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error.');
		}

		const supabase = createSupabaseRLSClient();

		const { error } = await supabase
			.from('feedback')
			.update({ is_handled: newState })
			.eq('id', feedbackId)
			.select('*')
			.maybeSingle();

		if (error) {
			console.error('Error handling feedback:', error);
			throw new InternalServerError('Error storing feedback');
		}

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
