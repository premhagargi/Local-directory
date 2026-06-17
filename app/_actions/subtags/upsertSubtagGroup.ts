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

type SubtagGroupFormState =
	| {
			errors?:
				| {
						name?: string[] | undefined;
				  }
				| undefined;
			success?: boolean | undefined;
	  }
	| undefined;

const SubtagGroupFormSchema = z.object({
	id: z.string().nullable(),
	name: z.string().min(2, { message: 'Be at least 2 characters long' }),
});

/**
 * Upserts a blog subtag_group in the database.
 *
 * @param state - The state of the subtag_group form.
 * @param formData - The form data containing the subtag_group information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertSubtagGroup(
	state: SubtagGroupFormState,
	formData: FormData
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const formatedFormData = formDataToObject(formData);

		const validatedFields = SubtagGroupFormSchema.safeParse(formatedFormData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as SubtagGroupFormState
			);
		}

		const supabase = createSupabaseRLSClient();

		if (!formData.get('id') || formData.get('id') === '') {
			const { error } = await supabase
				.from('subtag_groups')
				.insert({
					name: formData.get('name') as string,
				})
				.single();
			if (error) {
				console.error('Error inserting subtag_group:', error);
				throw new InternalServerError('Error storing subtag_group.');
			}
		} else {
			const { error } = await supabase
				.from('subtag_groups')
				.update({
					name: formData.get('name') as string,
					updated_at: new Date().toISOString(),
				})
				.eq('id', formData.get('id') as string)
				.single();

			if (error) {
				console.error('Error updating subtag_group:', error);
				throw new InternalServerError('Error updating subtag_group.');
			}
		}

		revalidatePath('/secret-admin/subtag-manager/new');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
