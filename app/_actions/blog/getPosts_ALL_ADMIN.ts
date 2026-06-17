'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	UnauthorizedError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves all blog posts that are admin protected.
 *
 * @returns A promise that resolves to the retrieved blog posts.
 */
export default async function getPosts_ALL_ADMIN() {
	try {
		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error.');
		}
		const supabase = createSupabaseRLSClient();
		const { data, error } = await supabase
			.from('blog_posts')
			.select(`*`)
			.order('is_admin_approved', { ascending: true });
		if (!data || error) {
			console.error('Error getting all blog posts (ADMIN PROTECTED):', error);
			throw new InternalServerError('Error getting blog posts');
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
