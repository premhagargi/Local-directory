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
 * @param sublistingId - The ID of the listing to add the rating to.
 * @returns The updated document.
 */
export default async function incrementStarRating(
	newRating: number,
	sublistingId: string
) {
	try {
		const supabase = createSupabaseRLSClient();
		if (!isValidUUID(sublistingId)) {
			console.error('Invalid UUID provided');
			return null;
		}
		if (!sublistingId || !newRating) {
			throw new BadRequestError('Invalid params provided');
		}

		const { error } = await supabase.rpc('update_rating_sublisting', {
			sublisting_id: sublistingId,
			new_rating: newRating,
		});

		if (error) {
			console.error('Error handling feedback:', error);
			throw new InternalServerError('Error storing feedback');
		}

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
