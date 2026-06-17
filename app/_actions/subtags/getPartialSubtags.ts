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
 * Retrieves partial subtags based on the provided modifier.
 * @param modifier - The modifier to determine the type of subtags to retrieve. Can be 'active' or 'all'.
 * @returns A promise that resolves to the retrieved partial subtags.
 */
export default async function getPartialSubtags(modifier: 'active' | 'all') {
	let results;
	try {
		const supabase = createSupabaseBrowserClient();

		if (modifier === 'active') {
			results = await supabase.rpc('get_active_subtags');
		} else if (modifier === 'all') {
			results = await supabase
				.from('subtags')
				.select(`id, name, slug, subtag_groups(id, name)`);
		} else {
			throw new BadRequestError('Invalid modifier.');
		}

		const { data, error } = results;

		if (error) {
			console.error('Error getting partial subtags:', error);
			throw new InternalServerError('Error getting subtags. Contact Support.');
		}

		return handleServerSuccess(
			data as {
				id: string;
				name: string;
				slug: string;
				subtag_groups: {
					id: string;
					name: string;
				}[];
			}[]
		);
	} catch (error) {
		return handleServerError(error, []);
	}
}
