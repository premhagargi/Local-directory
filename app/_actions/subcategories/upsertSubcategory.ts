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

type SubcategoryFormState =
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

const SubcategoryFormSchema = z.object({
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

const SubcategoryGroupIdsSchema = z.array(z.string());

/**
 * Upserts a subcategory in the database.
 *
 * @param state - The state of the subcategory form.
 * @param formData - The form data containing the subcategory information.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertSubcategory(
	formData: z.infer<typeof SubcategoryFormSchema>,
	subcategoryGroupIds: z.infer<typeof SubcategoryGroupIdsSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = SubcategoryFormSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as SubcategoryFormState
			);
		}

		const supabase = createSupabaseRLSClient();

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			delete validatedFields.data.id;
			const { data: newSubcategory, error } = await supabase
				.from('subcategories')
				.insert({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.select('id')
				.single();
			if (error || !newSubcategory.id) {
				console.error('Error inserting subcategory:', error);
				throw new InternalServerError('Error storing subcategory.');
			}

			const { error: deleteError } = await supabase
				.from('subcategory_groups_subcategories_association')
				.delete()
				.eq('subcategory_id', newSubcategory.id);

			if (deleteError) {
				console.error('Error deleting subcategory groups:', deleteError);
				throw new InternalServerError(
					'Error with subcategory group deletion. Contact Support.'
				);
			}

			const subcategoryGroups = subcategoryGroupIds.map(
				(subcategoryGroupId) => ({
					subcategory_id: newSubcategory.id,
					subcategory_group_id: subcategoryGroupId,
				})
			);

			const { error: subcategorysError } = await supabase
				.from('subcategory_groups_subcategories_association')
				.insert(subcategoryGroups);

			if (subcategorysError) {
				console.error('Error adding subcategory groups:', subcategorysError);
				throw new InternalServerError(
					'Error with subcategory group addition. Contact Support.'
				);
			}
		} else {
			const { data: updatedSubcategory, error } = await supabase
				.from('subcategories')
				.update({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.name),
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (error || !updatedSubcategory.id) {
				console.error('Error updating subcategory:', error);
				throw new InternalServerError('Error updating subcategory.');
			}

			const { error: deleteError } = await supabase
				.from('subcategory_groups_subcategories_association')
				.delete()
				.eq('subcategory_id', updatedSubcategory.id);

			if (deleteError) {
				console.error('Error updating subcategory groups:', deleteError);
				throw new InternalServerError(
					'Error with subcategory group update. Contact Support.'
				);
			}

			const subcategoryGroups = subcategoryGroupIds.map(
				(subcategoryGroupId) => ({
					subcategory_id: updatedSubcategory.id,
					subcategory_group_id: subcategoryGroupId,
				})
			);

			const { error: subcategorysError } = await supabase
				.from('subcategory_groups_subcategories_association')
				.insert(subcategoryGroups);

			if (subcategorysError) {
				console.error('Error updating subcategory groups:', subcategorysError);
				throw new InternalServerError(
					'Error with subcategory group update. Contact Support.'
				);
			}
		}

		revalidatePath('/', 'layout');

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
