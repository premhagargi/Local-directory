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
 * Retrieves subcategories with their corresponding listing count from the server.
 * @returns A promise that resolves to the subcategory stats data.
 */
async function getSubcategoriesWithSublistingCountUncached() {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase.rpc(
			'get_subcategories_with_sublisting_count'
		);
		if (error) {
			console.error('Error RPC get_subcategories_with_sublisting_count', error);
			throw new InternalServerError(
				'Error getting subcategory stats. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}

export const getSubcategoriesWithSublistingCount = unstable_cache(
	async () => {
		return await getSubcategoriesWithSublistingCountUncached();
	},
	['subcategoriesWithSublistingCount'],
	{ revalidate: 60 * 60 * 24 }
);
