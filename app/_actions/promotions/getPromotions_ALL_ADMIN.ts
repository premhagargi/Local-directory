'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Retrieves all promotions for the admin user.
 * @returns A promise that resolves to an array of promotion objects.
 */
export default async function getPromotions_ALL_ADMIN() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('promotions')
			.select(
				'*, listing:listings!inner(title), category:categories!inner(name)'
			);

		if (error) {
			console.error('Error getting promotions.', error);
			throw new InternalServerError('Error getting promotions.');
		}

		const extendedResults = data.map((promotion) => ({
			...promotion,
			listing_name: promotion.listing.title,
			category_name: promotion.category.name,
		}));

		return handleServerSuccess(extendedResults);
	} catch (error) {
		return handleServerError(error, []);
	}
}
