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
 * Retrieves a tag by its ID from the database.
 * @param tagId - The ID of the tag to retrieve.
 * @returns A promise that resolves to the retrieved tag.
 */
export default async function getTagByTagId(tagId: string) {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		results = await supabase
			.from('tags')
			.select(
				`id, name, slug, headline, description, image_url_hero, image_url_small, tag_groups(id, name), emoji, color, href`
			)
			.eq('id', tagId)
			.single();

		const { data, error } = results;

		if (error) {
			console.error('Error getting tag by id:', error);
			throw new InternalServerError('Error getting tag by id');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
