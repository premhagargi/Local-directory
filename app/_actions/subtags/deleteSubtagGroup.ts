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
 * Deletes subtag based on Subtag ID
 * @param subtagId - The subtag ID to delete.
 * @returns A promise that resolves to the retrieved subsubtags.
 */
export default async function deleteSubtagGroup(subtagGroupId: string) {
	let results;
	try {
		const supabase = createSupabaseRLSClient();

		results = await supabase
			.from('subtag_groups')
			.delete()
			.eq('id', subtagGroupId);

		const { data, error } = results;

		if (error) {
			console.error('Error deleting subtag group by id:', error);
			throw new InternalServerError('Error deleting subtag group by id');
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
