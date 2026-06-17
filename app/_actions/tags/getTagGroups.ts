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
 * Retrieves the tag groups based on the provided modifier.
 * @param modifier - The modifier to determine which topics to retrieve. Can be 'active' or 'all'.
 * @returns A promise that resolves to the retrieved tag groups.
 */
export async function getTagGroups() {
	try {
		const supabase = createSupabaseBrowserClient();
		const results = await supabase.from('tag_groups').select(`id, name`);
		const { data, error } = results;
		if (!data || error) {
			console.error('Error getting all tag groups:', error);
			throw new InternalServerError(
				'Error getting tag groups. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}

export const getAllTagGroups = unstable_cache(
	async () => {
		return await getTagGroups();
	},
	['all-tag-groups'],
	{ tags: [`all-tag-groups`] }
);
