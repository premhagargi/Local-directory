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
	BadRequestError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves the current ad for the specified slot.
 * @param slot - The name of the slot to retrieve the ad for.
 * @returns The data of the current ad, or false if an error occurred.
 */
export default async function getCommentsByCategoryAndId(
	category: 'blog_post_id' | 'listing_id' | 'sublisting_id',
	id: string
) {
	try {
		if (
			!category ||
			!id ||
			!['blog_post_id', 'listing_id', 'sublisting_id'].includes(category)
		) {
			throw new BadRequestError('Invalid fields to handle comment search.');
		}
		const supabase = createSupabaseBrowserClient();

		const { data, error } = await supabase
			.from('comments')
			.select(`*, author:users(username, avatar_url)`)
			.match({ is_approved: true, [category]: id });

		if (error) {
			console.error('Error handling comment search:', error);
			throw new InternalServerError(
				'Error retrieving comments. Contact Support.'
			);
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
