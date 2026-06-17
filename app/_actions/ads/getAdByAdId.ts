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
 * Retrieves an ad by its ID from the ad_campaigns table.
 * @param id - The ID of the ad to retrieve.
 * @returns A promise that resolves to the retrieved ad data.
 */
export default async function getAdByAdId(id: string) {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('ad_campaigns')
			.select('*')
			.match({ id })
			.single();

		if (error) {
			console.error('Error getting ad by ad id:', error);
			throw new InternalServerError('Error retrieving ad. Contact Support.');
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
