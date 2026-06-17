'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { isValidUUID } from '@/utils';
import {
	BadRequestError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Handles the PATCH request to add a star rating to a listing.
 * @param newRating - The new rating to add to the listing.
 * @param listingId - The ID of the listing to add the rating to.
 * @returns The updated document.
 */
export default async function incrementStarRating(
	newRating: number,
	listingId: string
) {
	try {
		const supabase = createSupabaseRLSClient();
		if (!isValidUUID(listingId)) {
			console.error('Invalid UUID provided');
			return null;
		}
		if (!isValidUUID(listingId) || !newRating) {
			throw new BadRequestError('Invalid params provided');
		}

		const { error } = await supabase.rpc('update_rating', {
			listing_id: listingId,
			new_rating: newRating,
		});

		if (error) {
			console.error('Error handling rating:', error);
			throw new InternalServerError('Error storing rating');
		}

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
