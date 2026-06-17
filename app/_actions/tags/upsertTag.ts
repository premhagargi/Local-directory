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

type TagFormState =
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

const TagFormSchema = z.object({
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

const TagGroupIdsSchema = z.array(z.string());

/**
 * Upserts a tag in the database.
 *
 * @param state - The state of the tag form.
 * @param formData - The form data containing the tag information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertTag(
	formData: z.infer<typeof TagFormSchema>,
	tagGroupIds: z.infer<typeof TagGroupIdsSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = TagFormSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as TagFormState
			);
		}
		const supabase = createSupabaseRLSClient();

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			delete validatedFields.data.id;
			const { data: newTag, error } = await supabase
				.from('tags')
				.insert({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.select('id')
				.single();

			if (error || !newTag.id) {
				console.error('Error inserting tag:', error);
				throw new InternalServerError('Error storing tag');
			}

			const { error: deleteError } = await supabase
				.from('tag_groups_tags_association')
				.delete()
				.eq('tag_id', newTag.id);

			if (deleteError) {
				console.error('Error deleting tag groups:', deleteError);
				throw new InternalServerError(
					'Error with tag group deletion. Contact Support.'
				);
			}

			const tagGroups = tagGroupIds.map((tagGroupId) => ({
				tag_id: newTag.id,
				tag_group_id: tagGroupId,
			}));

			const { error: tagsError } = await supabase
				.from('tag_groups_tags_association')
				.insert(tagGroups);

			if (tagsError) {
				console.error('Error adding tag groups:', tagsError);
				throw new InternalServerError(
					'Error with tag group addition. Contact Support.'
				);
			}
		} else {
			const { data: updatedTag, error } = await supabase
				.from('tags')
				.update({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (error || !updatedTag.id) {
				console.error('Error updating tag:', error);
				throw new InternalServerError('Error updating tag.');
			}

			const { error: deleteError } = await supabase
				.from('tag_groups_tags_association')
				.delete()
				.eq('tag_id', updatedTag.id);

			if (deleteError) {
				console.error('Error updating tag groups:', deleteError);
				throw new InternalServerError(
					'Error while updating tag groups. Contact Support.'
				);
			}

			const tagGroups = tagGroupIds.map((tagGroupId) => ({
				tag_id: updatedTag.id,
				tag_group_id: tagGroupId,
			}));

			const { error: tagsError } = await supabase
				.from('tag_groups_tags_association')
				.insert(tagGroups);

			if (tagsError) {
				console.error('Error updating tag groups:', tagsError);
				throw new InternalServerError(
					'Error while updating tag groups. Contact Support.'
				);
			}
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
