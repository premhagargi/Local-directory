'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves all comments for admin users.
 */
export default async function getComments_ALL_ADMIN() {
	try {
		const supabase = createSupabaseRLSClient();
		const { data, error } = await supabase
			.from('comments')
			.select(
				`*, author:users(username, avatar_url), blog_post_name: blog_posts!blog_post_id(title), listing_name:listings!listing_id(title), sublisting_name:sublistings!sublisting_id(title)`
			);

		if (error) {
			console.error('Error getting all comments (ADMIN PROTECTED):', error);
			throw new InternalServerError(
				'Error retrieving comments. Contact Support.'
			);
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
