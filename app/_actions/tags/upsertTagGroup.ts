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

type TagGroupFormState =
	| {
			errors?:
				| {
						name?: string[] | undefined;
				  }
				| undefined;
			success?: boolean | undefined;
	  }
	| undefined;

const TagGroupFormSchema = z.object({
	id: z.string().nullable(),
	name: z.string().min(2, { message: 'Be at least 2 characters long' }),
});

/**
 * Upserts a blog tag_group in the database.
 *
 * @param state - The state of the tag_group form.
 * @param formData - The form data containing the tag_group information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertTagGroup(
	state: TagGroupFormState,
	formData: FormData
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const formatedFormData = formDataToObject(formData);

		const validatedFields = TagGroupFormSchema.safeParse(formatedFormData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as TagGroupFormState
			);
		}

		const supabase = createSupabaseRLSClient();

		if (!formData.get('id') || formData.get('id') === '') {
			const { error } = await supabase
				.from('tag_groups')
				.insert({
					name: formData.get('name') as string,
				})
				.single();
			if (error) {
				console.error('Error inserting tag_group:', error);
				throw new InternalServerError('Error storing tag_group.');
			}
		} else {
			const { error } = await supabase
				.from('tag_groups')
				.update({
					name: formData.get('name') as string,
					updated_at: new Date().toISOString(),
				})
				.eq('id', formData.get('id') as string)
				.single();

			if (error) {
				console.error('Error updating tag_group:', error);
				throw new InternalServerError('Error updating tag_group.');
			}
		}

		revalidatePath('/secret-admin/tag-manager/new');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
