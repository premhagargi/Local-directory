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
 * Retrieves a blog post by its ID.
 *
 * @param id - The ID of the blog post to retrieve.
 * @returns A Promise that resolves to the retrieved blog post.
 */
export default async function getPostsByPostId(id: string) {
	let results;
	try {
		const supabase = createSupabaseRLSClient();
		results = await supabase
			.from('blog_posts')
			.select(`*`)
			.match({ id: id })
			.single();
		const { data, error } = results;
		if (!data || error) {
			console.error('Error getting blog posts by id:', error);
			throw new InternalServerError(
				'Error getting blog posts. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
