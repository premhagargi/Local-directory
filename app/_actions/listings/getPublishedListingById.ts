'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
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
 * Retrieves a published listing by its id.
 * @param id - The slug of the listing.
 * @returns The data of the published listing, or null if not found or an error occurred.
 */
export default async function getPublishedListingById(id: string) {
	try {
		const supabase = createSupabaseBrowserClient();

		const { data, error } = await supabase
			.from('listings')
			.select(listingParams)
			.match({ id: id, is_user_published: true, is_admin_published: true })
			.single();
		if (error) {
			console.error('Error finding listing by Id:', error);
			throw new InternalServerError(
				'Error retrieving listings. Contact Support.'
			);
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, {});
	}
}
