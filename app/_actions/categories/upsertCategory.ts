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

type CategoryFormState =
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

const CategoryFormSchema = z.object({
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

const CategoryGroupIdsSchema = z.array(z.string());

/**
 * Upserts a category in the database.
 *
 * @param state - The state of the category form.
 * @param formData - The form data containing the category information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertCategory(
	formData: z.infer<typeof CategoryFormSchema>,
	categoryGroupIds: z.infer<typeof CategoryGroupIdsSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = CategoryFormSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as CategoryFormState
			);
		}

		const supabase = createSupabaseRLSClient();

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			delete validatedFields.data.id;
			const { data: newCategory, error } = await supabase
				.from('categories')
				.insert({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.select('id')
				.single();
			if (error || !newCategory.id) {
				console.error('Error inserting category:', error);
				throw new InternalServerError('Error storing category.');
			}

			const { error: deleteError } = await supabase
				.from('category_groups_categories_association')
				.delete()
				.eq('category_id', newCategory.id);

			if (deleteError) {
				console.error('Error deleting category groups:', deleteError);
				throw new InternalServerError(
					'Error with category group deletion. Contact Support.'
				);
			}

			const categoryGroups = categoryGroupIds.map((categoryGroupId) => ({
				category_id: newCategory.id,
				category_group_id: categoryGroupId,
			}));

			const { error: categorysError } = await supabase
				.from('category_groups_categories_association')
				.insert(categoryGroups);

			if (categorysError) {
				console.error('Error adding category groups:', categorysError);
				throw new InternalServerError(
					'Error with category group addition. Contact Support.'
				);
			}
		} else {
			const { data: updatedCategory, error } = await supabase
				.from('categories')
				.update({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (error || !updatedCategory.id) {
				console.error('Error updating category:', error);
				throw new InternalServerError('Error updating category.');
			}

			const { error: deleteError } = await supabase
				.from('category_groups_categories_association')
				.delete()
				.eq('category_id', updatedCategory.id);

			if (deleteError) {
				console.error('Error updating category groups:', deleteError);
				throw new InternalServerError(
					'Error with category group update. Contact Support.'
				);
			}

			const categoryGroups = categoryGroupIds.map((categoryGroupId) => ({
				category_id: updatedCategory.id,
				category_group_id: categoryGroupId,
			}));

			const { error: categorysError } = await supabase
				.from('category_groups_categories_association')
				.insert(categoryGroups);

			if (categorysError) {
				console.error('Error updating category groups:', categorysError);
				throw new InternalServerError(
					'Error with category group update. Contact Support.'
				);
			}
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
