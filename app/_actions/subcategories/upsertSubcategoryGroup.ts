'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { formDataToObject } from '@/lib/utils';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
} from '@/lib/handlingServerResponses';

type SubcategoryGroupFormState =
	| {
			errors?:
				| {
						name?: string[] | undefined;
				  }
				| undefined;
			success?: boolean | undefined;
	  }
	| undefined;

const SubcategoryGroupFormSchema = z.object({
	id: z.string().nullable(),
	name: z.string().min(2, { message: 'Be at least 2 characters long' }),
});

/**
 * Upserts a blog subcategory_group in the database.
 *
 * @param state - The state of the subcategory_group form.
 * @param formData - The form data containing the subcategory_group information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertSubcategoryGroup(
	state: SubcategoryGroupFormState,
	formData: FormData
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const formatedFormData = formDataToObject(formData);

		const validatedFields =
			SubcategoryGroupFormSchema.safeParse(formatedFormData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as SubcategoryGroupFormState
			);
		}

		const supabase = createSupabaseRLSClient();

		if (!formData.get('id') || formData.get('id') === '') {
			const { error } = await supabase
				.from('subcategory_groups')
				.insert({
					name: formData.get('name') as string,
				})
				.single();
			if (error) {
				console.error('Error inserting subcategory_group:', error);
				throw new InternalServerError('Error storing subcategory_group.');
			}
		} else {
			const { error } = await supabase
				.from('subcategory_groups')
				.update({
					name: formData.get('name') as string,
					updated_at: new Date().toISOString(),
				})
				.eq('id', formData.get('id') as string)
				.single();

			if (error) {
				console.error('Error updating subcategory_group:', error);
				throw new InternalServerError('Error updating subcategory_group.');
			}
		}

		revalidatePath('/secret-admin/subcategory-manager/new');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
