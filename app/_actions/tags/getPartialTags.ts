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

/**
 * Retrieves partial tags based on the provided modifier.
 * @param modifier - The modifier to determine the type of tags to retrieve. Can be 'active' or 'all'.
 * @returns A promise that resolves to the retrieved partial tags.
 */
export default async function getPartialTags(modifier: 'active' | 'all') {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		if (modifier === 'active') {
			results = await supabase.rpc('get_active_tags');
		} else if (modifier === 'all') {
			results = await supabase
				.from('tags')
				.select(`id, name, slug, tag_groups(id, name)`);
		} else {
			throw new BadRequestError('Invalid modifier.');
		}

		const { data, error } = results;

		if (error) {
			console.error('Error getting partial tags:', error);
			throw new InternalServerError('Error getting tags. Contact Support.');
		}

		return handleServerSuccess(
			data as {
				id: string;
				name: string;
				slug: string;
				tag_groups: {
					id: string;
					name: string;
				}[];
			}[]
		);
	} catch (error) {
		return handleServerError(error, []);
	}
}
