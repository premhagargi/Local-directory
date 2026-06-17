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
 * Deletes category based on Category ID
 * @param categoryId - The category ID to delete.
 * @returns A promise that resolves to the retrieved categories.
 */
export default async function deleteCategoryGroup(categoryGroupId: string) {
	let results;
	try {
		const supabase = createSupabaseRLSClient();

		results = await supabase
			.from('category_groups')
			.delete()
			.eq('id', categoryGroupId);

		const { data, error } = results;

		if (error) {
			console.error('Error deleting category group by id:', error);
			throw new InternalServerError('Error deleting category group by id');
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
