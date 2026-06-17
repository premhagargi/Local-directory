'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
import { BOT_USER_ID } from '@/constants';
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Inserts a new activity into the activities table.
 * @param type - The type of the activity.
 * @param value - The value of the activity.
 * @param isBot - Indicates whether the activity is performed by a bot.
 * @returns A promise that resolves to the result of the server operation.
 */
export default async function insertActivity(
	type: string = 'unknown',
	value: string,
	isBot = false
) {
	try {
		const { user } = await serverAuth({ checkUser: true });
		const supabase = createSupabaseRLSClient();
		const { error } = await supabase.from('activities').insert([
			{
				type: type,
				value: value.replace(/[^a-zA-Z0-9 ]/g, ''),
				user_id: isBot ? BOT_USER_ID : user?.id || null,
			},
		]);
		if (error) {
			console.error('Error while inserting new activity:', error);
			throw new InternalServerError(
				'Error with this request. Contact Support.'
			);
		}
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
