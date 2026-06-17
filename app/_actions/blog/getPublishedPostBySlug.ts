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
 * Retrieves a published blog post by its slug.
 *
 * @param slug - The slug of the blog post.
 * @returns A Promise that resolves to the retrieved blog post.
 */
async function publishedPostBySlug(slug: string) {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('blog_posts')
			.select(`*, author:users!inner(*)`)
			.match({ slug: slug, is_admin_approved: true, is_user_published: true })
			.single();
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

export async function getPublishedPostBySlug(slug: string) {
	const postBySlug = unstable_cache(
		async (slug: string) => {
			return await publishedPostBySlug(slug);
		},
		[`post-${slug}`],
		{ tags: [`post-${slug}`] }
	);
	return await postBySlug(slug);
}
