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
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Counts the number of blog posts.
 *
 * @returns The number of blog posts.
 */
export default async function countPosts() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { error, count } = await supabase
			.from('blog_posts')
			.select(`id`, { count: 'exact' });
		if (error) {
			console.error('Error counting posts:', error);
			throw new InternalServerError('Error counting posts. Contact Support.');
		}
		return handleServerSuccess(count || 0);
	} catch (error) {
		return handleServerError(error, 0);
	}
}
