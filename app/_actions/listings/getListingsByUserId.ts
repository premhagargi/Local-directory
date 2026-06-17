'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { listingParams } from '@/lib/supabaseQueries';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves listings by user ID.
 * @param finder_id - The ID of the user.
 * @returns A Promise that resolves to the retrieved listings.
 */
export default async function getListingsByUserId(finder_id: string) {
	try {
		const supabase = createSupabaseRLSClient();
		const { data, error } = await supabase
			.from('listings')
			.select(listingParams)
			.match({ finder_id: finder_id });
		if (error) {
			console.error('Error getting listings by users:', error);
			throw new InternalServerError(
				'Error retrieving listings. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
