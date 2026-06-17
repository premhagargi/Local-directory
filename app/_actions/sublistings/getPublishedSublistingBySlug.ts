'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { sublistingsParams } from '@/lib/supabaseQueries';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves a published sublisting by its slug.
 * @param slug - The slug of the sublisting.
 * @returns The data of the published sublisting, or null if not found or an error occurred.
 */
export default async function getPublishedSublistingBySlug(slug: string) {
	try {
		const supabase = createSupabaseBrowserClient();

		const { data, error } = await supabase
			.from('sublistings')
			.select(sublistingsParams)
			.match({ slug: slug, is_user_published: true, is_admin_published: true })
			.single();
		if (error) {
			console.error('Error finding sublisting by Slug:', error);
			throw new InternalServerError(
				'Error retrieving sublistings. Contact Support.'
			);
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, {});
	}
}
