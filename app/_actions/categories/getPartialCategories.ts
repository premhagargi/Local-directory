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

type partialCategory = {
	id: string;
	name: string;
	slug: string;
	category_groups: {
		id: string;
		name: string;
	}[];
};

/**
 * Retrieves partial categories based on the specified modifier.
 * @param modifier - The modifier to determine which categories to retrieve. Can be 'active' or 'all'.
 * @returns A promise that resolves to the retrieved partial categories.
 */
export default async function getPartialCategories(modifier: 'active' | 'all') {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		if (modifier === 'active') {
			results = await supabase.rpc('get_active_categories');
		} else if (modifier === 'all') {
			results = await supabase
				.from('categories')
				.select(`id, name, slug, category_groups(id, name)`);
		} else {
			throw new BadRequestError('Invalid modifier.');
		}
		const { data, error } = results;

		if (error) {
			console.error('Error getting partial categories:', error);
			throw new InternalServerError(
				'Error getting categories. Contact Support.'
			);
		}

		return handleServerSuccess(data as partialCategory[]);
	} catch (error) {
		return handleServerError(error, []);
	}
}
