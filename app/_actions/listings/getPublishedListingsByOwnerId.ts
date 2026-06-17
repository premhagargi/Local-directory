'use server';

import { listingParams } from '@/lib/supabaseQueries';
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
 * Retrieves a published listing by its slug.
 * @param userId - The id of the listing owner.
 * @returns The data of the published listing, or null if not found or an error occurred.
 */
export default async function getPublishedListingsByOwnerId(userId: string) {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('listings')
			.select(listingParams)
			.match({
				owner_id: userId,
				is_user_published: true,
				is_admin_published: true,
			});

		if (error) {
			console.error('Error finding listings by owner id:', error);
			throw new InternalServerError(
				'Error retrieving listings. Contact Support.'
			);
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
