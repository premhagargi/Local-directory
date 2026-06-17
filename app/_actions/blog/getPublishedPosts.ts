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
 * Retrieves all published blog posts that are approved by the admin and published by the user.
 *
 * @returns A promise that resolves to an array of published blog posts.
 */
async function publishedPosts() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('blog_posts')
			.select(`*`)
			.match({ is_admin_approved: true, is_user_published: true })
			.order('published_at', { ascending: false });
		if (!data || error) {
			console.error('Error getting all blog posts (ADMIN PROTECTED):', error);
			throw new InternalServerError('Error getting blog posts');
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}

export const getPublishedPosts = unstable_cache(
	async () => {
		return await publishedPosts();
	},
	['all-published-blog-posts'],
	{ tags: [`all-published-blog-posts`] }
);
