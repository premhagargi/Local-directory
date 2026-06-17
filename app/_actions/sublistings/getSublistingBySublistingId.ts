'use server';
// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { sublistingsParams } from '@/lib/supabaseQueries';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves a sublisting by its ID from the database.
 * @param id - The ID of the sublisting to retrieve.
 * @returns A Promise that resolves to the retrieved sublisting data.
 */
export default async function getSublistingBySublistingId(id: string) {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('sublistings')
			.select(sublistingsParams)
			.match({ id: id })
			.single();
		if (error) {
			console.error('Error getting sublistings by sublisting id:', error);
			throw new InternalServerError(
				'Error retrieving sublistings. Contact Support.'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
