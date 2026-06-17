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

type fullSubcategory = {
	id: string;
	name: string;
	slug: string;
	headline: string | null;
	description: string | null;
	image_url_hero: string | null;
	image_url_small: string | null;
	subcategory_groups: {
		id: string;
		name: string;
	}[];
	emoji: string | null;
	color: string | null;
	href: string | null;
};

/**
 * Retrieves full subcategories based on the provided modifier.
 * @param modifier - The modifier to determine the type of subcategories to retrieve. Can be either 'active' or 'all'.
 * @returns A Promise that resolves to the retrieved subcategories.
 */
export default async function getFullSubcategories(modifier: 'active' | 'all') {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		if (modifier === 'active') {
			results = await supabase.rpc('get_full_active_subcategories');
		} else if (modifier === 'all') {
			results = await supabase
				.from('subcategories')
				.select(
					`id, name, slug, headline, description, image_url_hero, image_url_small, subcategory_groups(id, name), emoji, color, href`
				);
		} else {
			throw new BadRequestError('Invalid modifier.');
		}
		const { data, error } = results;

		if (error) {
			console.error('Error getting full subcategories:', error);
			throw new InternalServerError(
				'Error getting subcategories. Contact Support.'
			);
		}

		return handleServerSuccess(data as fullSubcategory[]);
	} catch (error) {
		return handleServerError(error, []);
	}
}
