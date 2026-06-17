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
 * Retrieves blog posts by user ID.
 *
 * @param user_id - The ID of the user.
 * @returns A Promise that resolves to an array of blog post data.
 */
export default async function getPostsByUserId(user_id: string) {
	let results;
	try {
		const supabase = createSupabaseRLSClient();
		results = await supabase
			.from('blog_posts')
			.select(`*`)
			.match({ user_id: user_id })
			.order('created_at', { ascending: false });
		const { data, error } = results;
		if (!data || error) {
			console.error('Error getting blog posts by user id:', error);
			throw new InternalServerError(
				'Error getting blog posts. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
