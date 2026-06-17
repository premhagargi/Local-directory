'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { sublistingsParams } from '@/lib/supabaseQueries';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves sublistings by user ID.
 * @param listing_id - The ID of the user.
 * @returns A Promise that resolves to the retrieved sublistings.
 */
export default async function getSublistingsByFinderId(finder_id: string) {
	try {
		const supabase = createSupabaseRLSClient();

		const { data, error } = await supabase
			.from('sublistings')
			.select(sublistingsParams)
			.match({ finder_id: finder_id });
		if (error) {
			console.error('Error getting sublistings by users:', error);
			throw new InternalServerError(
				'Error retrieving sublistings. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
