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
 * Retrieves the current ad for the specified slot.
 * @param slot - The name of the slot to retrieve the ad for.
 * @returns The data of the current ad, or false if an error occurred.
 */
export default async function getAdByAdSlot(slot: string) {
	const currentTimestamp = new Date().toISOString();
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('ad_campaigns')
			.select(`id, redirect_url, image_url`)
			.match({
				slot_name: slot,
			})
			.lte('start_date', currentTimestamp)
			.gte('end_date', currentTimestamp)
			.limit(1)
			.maybeSingle();
		if (error) {
			console.error('Error getting ad by ad slot:', error);
			throw new InternalServerError('Error retrieving ad. Contact Support.');
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, {});
	}
}
