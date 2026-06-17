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
 * Deletes subcategory based on Subcategory ID
 * @param subcategoryId - The subcategory ID to delete.
 * @returns A promise that resolves to the retrieved subcategories.
 */
export default async function deleteSubcategoryGroup(
	subcategoryGroupId: string
) {
	let results;
	try {
		const supabase = createSupabaseRLSClient();

		results = await supabase
			.from('subcategory_groups')
			.delete()
			.eq('id', subcategoryGroupId);

		const { data, error } = results;

		if (error) {
			console.error('Error deleting subcategory group by id:', error);
			throw new InternalServerError('Error deleting subcategory group by id');
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
