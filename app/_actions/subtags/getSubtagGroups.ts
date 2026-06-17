'use server';

// Import Types
// Import External Packages
import { unstable_cache } from 'next/cache';
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
 * Retrieves the subtag groups based on the provided modifier.
 * @param modifier - The modifier to determine which topics to retrieve. Can be 'active' or 'all'.
 * @returns A promise that resolves to the retrieved subtag groups.
 */
export async function getSubtagGroups() {
	try {
		const supabase = createSupabaseBrowserClient();
		const results = await supabase.from('subtag_groups').select(`id, name`);
		const { data, error } = results;
		if (!data || error) {
			console.error('Error getting all subtag groups:', error);
			throw new InternalServerError(
				'Error getting subtag groups. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}

export const getAllSubtagGroups = unstable_cache(
	async () => {
		return await getSubtagGroups();
	},
	['all-subtag-groups'],
	{ tags: [`all-subtag-groups`] }
);
