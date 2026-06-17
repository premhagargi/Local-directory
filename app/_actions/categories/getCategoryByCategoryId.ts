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
 * Retrieves a category by its ID from the database.
 * @param categoryId - The ID of the category to retrieve.
 * @returns A promise that resolves to the retrieved category.
 */
export default async function getCategoryByCategoryId(categoryId: string) {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		results = await supabase
			.from('categories')
			.select(
				`id, name, slug, headline, description, image_url_hero, image_url_small, category_groups(id, name), emoji, color, href`
			)
			.eq('id', categoryId)
			.single();

		const { data, error } = results;

		if (error) {
			console.error('Error getting category by id:', error);
			throw new InternalServerError('Error getting category by id');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
