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
 * Retrieves a subcategory by its ID from the database.
 * @param subcategoryId - The ID of the subcategory to retrieve.
 * @returns A promise that resolves to the retrieved subcategory.
 */
export default async function getSubcategoryBySubcategoryId(
	subcategoryId: string
) {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		results = await supabase
			.from('subcategories')
			.select(
				`id, name, slug, headline, description, image_url_hero, image_url_small, subcategory_groups(id, name), emoji, color, href`
			)
			.eq('id', subcategoryId)
			.single();

		const { data, error } = results;

		if (error) {
			console.error('Error getting subcategory by id:', error);
			throw new InternalServerError('Error getting subcategory by id');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
