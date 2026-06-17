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
 * Counts the number of ads based on the current timestamp.
 * @returns The count of ads.
 */
export default async function countAds() {
	const currentTimestamp = new Date().toISOString();
	try {
		const supabase = createSupabaseBrowserClient();

		const { count, error } = await supabase
			.from('ad_campaigns')
			.select(`id`, { count: 'exact' })
			.lte('start_date', currentTimestamp)
			.gte('end_date', currentTimestamp);
		if (error) {
			console.error('Error counting ads:', error);
			throw new InternalServerError(
				'Error counting ads! Please try again later.'
			);
		}
		return handleServerSuccess(count || 0);
	} catch (error) {
		return handleServerError(error, 0);
	}
}
