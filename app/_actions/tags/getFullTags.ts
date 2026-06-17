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
	BadRequestError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

type fullTag = {
	id: string;
	name: string;
	slug: string;
	headline: string | null;
	description: string | null;
	image_url_hero: string | null;
	image_url_small: string | null;
	tag_groups: {
		id: string;
		name: string;
	}[];
	emoji: string | null;
	color: string | null;
	href: string | null;
};
/**
 * Retrieves full tags based on the provided modifier.
 * @param modifier - The modifier to determine which tags to retrieve. Can be either 'active' or 'all'.
 * @returns A promise that resolves to the retrieved tags.
 */
export default async function getFullTags(modifier: 'active' | 'all') {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		if (modifier === 'active') {
			results = await supabase.rpc('get_full_active_tags');
		} else if (modifier === 'all') {
			results = await supabase
				.from('tags')
				.select(
					`id, name, slug, headline, description, image_url_hero, image_url_small, tag_groups(id, name), emoji, color, href`
				);
		} else {
			throw new BadRequestError('Invalid modifier.');
		}

		const { data, error } = results;

		if (error) {
			console.error('Error getting partial tags:', error);
			throw new InternalServerError('Error getting partial tags');
		}

		return handleServerSuccess(data as fullTag[]);
	} catch (error) {
		return handleServerError(error, []);
	}
}
