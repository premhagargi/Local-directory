'use server';

// Import Types
// Import External Packages
import { unstable_cache } from 'next/cache';
// Import Components
// Import Functions & Actions & Hooks & State#
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
 * Retrieves categories with their corresponding listing count from the server.
 * @returns A promise that resolves to the category stats data.
 */
async function getCategoriesWithListingCountUncached() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase.rpc(
			'get_categories_with_listing_count'
		);
		if (error) {
			console.error('Error RPC get_categories_with_listing_count', error);
			throw new InternalServerError(
				'Error getting category stats. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}

export const getCategoriesWithListingCount = unstable_cache(
	async () => {
		return await getCategoriesWithListingCountUncached();
	},
	['categoriesWithListingCount'],
	{ revalidate: 60 * 60 * 24 }
);
