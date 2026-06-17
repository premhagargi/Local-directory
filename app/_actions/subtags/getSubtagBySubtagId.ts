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
 * Retrieves a subtag by its ID from the database.
 * @param subtagId - The ID of the subtag to retrieve.
 * @returns A promise that resolves to the retrieved subtag.
 */
export default async function getSubtagBySubtagId(subtagId: string) {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		results = await supabase
			.from('subtags')
			.select(
				`id, name, slug, headline, description, image_url_hero, image_url_small, subtag_groups(id, name), emoji, color, href`
			)
			.eq('id', subtagId)
			.single();

		const { data, error } = results;

		if (error) {
			console.error('Error getting subtag by id:', error);
			throw new InternalServerError('Error getting subtag by id');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
