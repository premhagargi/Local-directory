'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { formDataToObject, stringToSlug } from '@/lib/utils';
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

type TopicFormState =
	| {
			errors?:
				| {
						name?: string[] | undefined;
				  }
				| undefined;
			success?: boolean | undefined;
	  }
	| undefined;

const TopicFormSchema = z.object({
	id: z.string().nullable(),
	slug: z.string().nullable(),
	name: z.string().min(2, { message: 'Be at least 2 characters long' }),
});

/**
 * Upserts a blog topic in the database.
 *
 * @param state - The state of the topic form.
 * @param formData - The form data containing the topic information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertBlogTopic(
	state: TopicFormState,
	formData: FormData
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const formatedFormData = formDataToObject(formData);

		const validatedFields = TopicFormSchema.safeParse(formatedFormData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as TopicFormState
			);
		}

		const supabase = createSupabaseRLSClient();

		if (!formData.get('id') || formData.get('id') === '') {
			const { error } = await supabase
				.from('topics')
				.insert({
					name: formData.get('name') as string,
					slug: stringToSlug(formData.get('name') as string),
				})
				.single();
			if (error) {
				console.error('Error inserting topic:', error);
				throw new InternalServerError('Error storing topic.');
			}
		} else {
			const { error } = await supabase
				.from('topics')
				.update({
					name: formData.get('name') as string,
					slug: stringToSlug(formData.get('name') as string),
					updated_at: new Date().toISOString(),
				})
				.eq('id', formData.get('id') as string)
				.single();

			if (error) {
				console.error('Error updating topic:', error);
				throw new InternalServerError('Error updating topic.');
			}
		}

		revalidatePath('/account/new-post');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
