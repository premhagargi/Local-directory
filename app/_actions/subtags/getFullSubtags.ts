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

type fullSubsubtag = {
	id: string;
	name: string;
	slug: string;
	headline: string | null;
	description: string | null;
	image_url_hero: string | null;
	image_url_small: string | null;
	subtag_groups: {
		id: string;
		name: string;
	}[];
	emoji: string | null;
	color: string | null;
	href: string | null;
};
/**
 * Retrieves full subtags based on the provided modifier.
 * @param modifier - The modifier to determine which subtags to retrieve. Can be either 'active' or 'all'.
 * @returns A promise that resolves to the retrieved subtags.
 */
export default async function getFullSubsubtags(modifier: 'active' | 'all') {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		if (modifier === 'active') {
			results = await supabase.rpc('get_full_active_subtags');
		} else if (modifier === 'all') {
			results = await supabase
				.from('subtags')
				.select(
					`id, name, slug, headline, description, image_url_hero, image_url_small, subtag_groups(id, name), emoji, color, href`
				);
		} else {
			throw new BadRequestError('Invalid modifier.');
		}

		const { data, error } = results;

		if (error) {
			console.error('Error getting partial subtags:', error);
			throw new InternalServerError('Error getting partial subtags');
		}

		return handleServerSuccess(data as fullSubsubtag[]);
	} catch (error) {
		return handleServerError(error, []);
	}
}
