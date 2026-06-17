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
 * Retrieves the blog topics based on the provided modifier.
 * @param modifier - The modifier to determine which topics to retrieve. Can be 'active' or 'all'.
 * @returns A promise that resolves to the retrieved blog topics.
 */
export async function getBlogTopics(modifier: 'active' | 'all') {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();
		if (modifier === 'active') {
			results = await supabase.rpc('get_active_topics');
		} else {
			results = await supabase.from('topics').select(`id, name, slug`);
		}
		const { data, error } = results;
		if (!data || error) {
			console.error('Error getting all blog topics:', error);
			throw new InternalServerError(
				'Error getting blog topics. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}

export const getActiveBlogTopics = unstable_cache(
	async () => {
		return await getBlogTopics('active');
	},
	['active-blog-topics'],
	{ tags: [`active-blog-topics`] }
);

export const getAllBlogTopics = unstable_cache(
	async () => {
		return await getBlogTopics('all');
	},
	['all-blog-topics'],
	{ tags: [`all-blog-topics`] }
);
