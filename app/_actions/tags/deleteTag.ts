'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Deletes tag based on Tag ID
 * @param tagId - The tag ID to delete.
 * @returns A promise that resolves to the retrieved tags.
 */
export default async function deleteTag(tagId: string) {
	let results;
	try {
		const supabase = createSupabaseRLSClient();

		results = await supabase.from('tags').delete().eq('id', tagId);

		const { data, error } = results;

		if (error) {
			console.error('Error deleting tag by id:', error);
			throw new InternalServerError('Error deleting tag by id');
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
