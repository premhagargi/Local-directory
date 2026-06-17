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

type partialSubcategory = {
	id: string;
	name: string;
	slug: string;
	subcategory_groups: {
		id: string;
		name: string;
	}[];
};

/**
 * Retrieves partial subcategories based on the specified modifier.
 * @param modifier - The modifier to determine which subcategories to retrieve. Can be 'active' or 'all'.
 * @returns A promise that resolves to the retrieved partial subcategories.
 */
export default async function getPartialSubcategories(
	modifier: 'active' | 'all'
) {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		if (modifier === 'active') {
			results = await supabase.rpc('get_active_subcategories');
		} else if (modifier === 'all') {
			results = await supabase
				.from('subcategories')
				.select(`id, name, slug, subcategory_groups(id, name)`);
		} else {
			throw new BadRequestError('Invalid modifier.');
		}
		const { data, error } = results;

		if (error) {
			console.error('Error getting partial subcategories:', error);
			throw new InternalServerError(
				'Error getting subcategories. Contact Support.'
			);
		}

		return handleServerSuccess(data as partialSubcategory[]);
	} catch (error) {
		return handleServerError(error, []);
	}
}
