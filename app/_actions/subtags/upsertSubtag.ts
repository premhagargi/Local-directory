'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { stringToSlug } from '@/utils';
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

type SubtagFormState =
	| {
			errors?:
				| {
						name?: string[] | undefined;
						headline?: string[] | undefined;
						description?: string[] | undefined;
				  }
				| undefined;
			success?: boolean | undefined;
	  }
	| undefined;

const SubtagFormSchema = z.object({
	id: z.optional(z.string()),
	name: z.string().min(2, { message: 'Be at least 2 characters long' }),
	headline: z
		.string()
		.min(10, { message: 'Be at least 10 characters long' })
		.max(60, { message: 'Be at most 60 characters long' }),
	description: z
		.string()
		.min(10, { message: 'Be at least 10 characters long' })
		.max(160, { message: 'Be at most 160 characters long' }),
	image_url_hero: z.optional(z.string()),
	image_url_small: z.optional(z.string()),
	emoji: z.optional(z.string()),
	href: z.optional(z.string()),
	color: z.optional(z.string()),
});

const SubtagGroupIdsSchema = z.array(z.string());

/**
 * Upserts a subtag in the database.
 *
 * @param state - The state of the subtag form.
 * @param formData - The form data containing the subtag information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertSubtag(
	formData: z.infer<typeof SubtagFormSchema>,
	subtagGroupIds: z.infer<typeof SubtagGroupIdsSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = SubtagFormSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as SubtagFormState
			);
		}
		const supabase = createSupabaseRLSClient();

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			delete validatedFields.data.id;
			const { data: newSubtag, error } = await supabase
				.from('subtags')
				.insert({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.select('id')
				.single();

			if (error || !newSubtag.id) {
				console.error('Error inserting subtag:', error);
				throw new InternalServerError('Error storing subtag');
			}

			const { error: deleteError } = await supabase
				.from('subtag_groups_subtags_association')
				.delete()
				.eq('subtag_id', newSubtag.id);

			if (deleteError) {
				console.error('Error deleting subtag groups:', deleteError);
				throw new InternalServerError(
					'Error with subtag group deletion. Contact Support.'
				);
			}

			const subtagGroups = subtagGroupIds.map((subtagGroupId) => ({
				subtag_id: newSubtag.id,
				subtag_group_id: subtagGroupId,
			}));

			const { error: subtagsError } = await supabase
				.from('subtag_groups_subtags_association')
				.insert(subtagGroups);

			if (subtagsError) {
				console.error('Error adding subtag groups:', subtagsError);
				throw new InternalServerError(
					'Error with subtag group addition. Contact Support.'
				);
			}
		} else {
			const { data: updatedSubtag, error } = await supabase
				.from('subtags')
				.update({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (error || !updatedSubtag.id) {
				console.error('Error updating subtag:', error);
				throw new InternalServerError('Error updating subtag.');
			}

			const { error: deleteError } = await supabase
				.from('subtag_groups_subtags_association')
				.delete()
				.eq('subtag_id', updatedSubtag.id);

			if (deleteError) {
				console.error('Error updating subtag groups:', deleteError);
				throw new InternalServerError(
					'Error while updating subtag groups. Contact Support.'
				);
			}

			const subtagGroups = subtagGroupIds.map((subtagGroupId) => ({
				subtag_id: updatedSubtag.id,
				subtag_group_id: subtagGroupId,
			}));

			const { error: subtagsError } = await supabase
				.from('subtag_groups_subtags_association')
				.insert(subtagGroups);

			if (subtagsError) {
				console.error('Error updating subtag groups:', subtagsError);
				throw new InternalServerError(
					'Error while updating subtag groups. Contact Support.'
				);
			}
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
