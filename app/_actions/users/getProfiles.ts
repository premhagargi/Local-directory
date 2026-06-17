'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Retrieves user profiles from the server.
 * @returns A Promise that resolves to the retrieved user profiles.
 */
export default async function getProfiles() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase.rpc('get_user_usernames');

		if (error) {
			console.error('Error handling getting profiles:', error);
			throw new InternalServerError('Error getting profiles');
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
