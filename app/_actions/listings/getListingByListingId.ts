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
 * Retrieves a listing by its ID from the database.
 * @param id - The ID of the listing to retrieve.
 * @returns A Promise that resolves to the retrieved listing data.
 */
export default async function getListingByListingId(id: string) {
	try {
		const supabase = createSupabaseRLSClient();
		const { data, error } = await supabase
			.from('listings')
			.select(listingParams)
			.match({ id: id })
			.single();
		if (error) {
			console.error('Error getting listings by listing id:', error);
			throw new InternalServerError(
				'Error retrieving listings. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, {});
	}
}
