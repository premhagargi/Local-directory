'use server';

// Import Types
// Import External Packages
import { unstable_cache } from 'next/cache';
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
 * Retrieves all slugs from published blog posts. WITH CACHE
 *
 */
async function allSlugsFromPublishedPosts() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('blog_posts')
			.select(`slug`)
			.match({ is_admin_approved: true, is_user_published: true });
		if (!data || error) {
			console.error('Error getting all blog slugs:', error);
			throw new InternalServerError('Error getting blog slugs');
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}

export const getAllSlugsFromPublishedPosts = unstable_cache(
	async () => {
		return await allSlugsFromPublishedPosts();
	},
	['all-blog-slugs'],
	{ tags: [`all-blog-slugs`] }
);
