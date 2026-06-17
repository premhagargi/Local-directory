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
 * Retrieves the taken promotion dates from the 'promotions' table.
 *
 * @returns A promise that resolves to an array of taken promotion dates.
 */
export default async function getTakenPromotionDates() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('promotions')
			.select('start_date, end_date, category_id');

		if (error) {
			console.error('Error getting disabled promotion dates.', error);
			throw new InternalServerError('Error getting disabled promotion dates.');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
