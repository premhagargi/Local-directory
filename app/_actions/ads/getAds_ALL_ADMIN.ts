'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves all ads for admin users.
 *
 * @returns A promise that resolves to the retrieved ads.
 */

export default async function getAds_ALL_ADMIN() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase.from('ad_campaigns').select('*');

		if (error) {
			console.error('Error getting all ads (ADMIN PROTECTED)', error);
			throw new InternalServerError('Error retrieving ads. Contact Support.');
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
