'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import generateEmbeddings from '@/actions/sublistings/generateEmbeddings';
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
import { isValidUUID, stringToSlug } from '@/lib/utils';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
	UnauthorizedError,
	BadRequestError,
} from '@/lib/handlingServerResponses';

const SublistingFormSchema = z.object({
	id: z.optional(z.string()),
	title: z.string().min(2, { message: 'Should at least 2 characters long' }),
	excerpt: z
		.string()
		.min(20, { message: 'Should be at least 20 characters long' })
		.max(160, { message: 'Should beat most 160 characters long' }),
	description: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
	subcategory_id: z.string().min(2, { message: 'Category is missing.' }),
	listing_id: z.string().min(2, { message: 'Listing is missing.' }),
	default_image_url: z
		.string()
		.optional()
		.refine(
			(value) => value === '' || value === undefined || value.length >= 2,
			{
				message: 'Full name must be at least 2 characters long',
			}
		),
	is_user_published: z.boolean().nullable(),
	is_admin_published: z.optional(z.boolean().nullable()),
	click_url: z.string().url(),
	price_regular_in_cents: z.optional(z.coerce.number()),
	price_promotional_in_cents: z.optional(z.coerce.number()),
	size: z.optional(z.string()),
	availability: z.boolean(),
});

const SublistingSubtagsSchema = z.array(z.string());

/**
 * Upserts a sublisting with the provided form data, subtag IDs, and embeddings flag.
 *
 * @param formData - The form data for the sublisting.
 * @param subtagIds - The subtag IDs for the sublisting.
 * @param needsEmbeddings - A flag indicating whether embeddings are needed for the sublisting.
 * @returns A promise that resolves to a server response containing the upserted sublisting.
 */
export default async function upsertSublisting(
	formData: z.infer<typeof SublistingFormSchema>,
	subtagIds: z.infer<typeof SublistingSubtagsSchema>,
	needsEmbeddings: boolean
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const { user, error: authError } = await serverAuth({
			mustBeSignedIn: true,
			checkUser: true,
		});

		if (authError || !user) {
			throw new UnauthorizedError('Auth Error.');
		}

		const validatedFields = SublistingFormSchema.safeParse(formData);

		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const validatedSubtags = SublistingSubtagsSchema.safeParse(subtagIds);

		if (!validatedSubtags.success) {
			throw new HookFormError(validatedSubtags.error.flatten().fieldErrors);
		}

		const supabase = createSupabaseRLSClient();

		let sublistingEmbeddings: number[] = [];

		if (needsEmbeddings) {
			const { data: newSublistingEmbeddings } = await generateEmbeddings({
				title: validatedFields.data.title,
				description: validatedFields.data.description,
				excerpt: validatedFields.data.excerpt,
			});
			sublistingEmbeddings = newSublistingEmbeddings;
		}

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			const adminApproved =
				validatedFields.data.is_admin_published === true
					? true
					: GENERAL_SETTINGS.PRE_ADMIN_APPROVE_SUBLISTINGS;
			delete validatedFields.data.id;
			delete validatedFields.data.is_admin_published;

			const { data: newSublisting, error: sublistingError } = await supabase
				.from('sublistings')
				.insert({
					...validatedFields.data,
					slug:
						stringToSlug(validatedFields.data.title) +
						'-' +
						validatedFields.data.listing_id.slice(0, 8),
					embedding: JSON.stringify(sublistingEmbeddings),
					is_admin_published: adminApproved,
					finder_id: user.id,
				})
				.select('id')
				.single();

			if (sublistingError || !newSublisting.id) {
				console.error('Error upserting sublisting:', sublistingError);
				const typeError = sublistingError?.message.includes(
					'duplicate key value'
				)
					? 'A sublisting with this name already exsist. Check if the sublisting you want to include already exists. If not consider changing the name please.'
					: 'Unknown Error. Please contact support.';
				throw new InternalServerError(typeError);
			}

			const { error: deleteError } = await supabase
				.from('sublistings_subtags')
				.delete()
				.eq('sublisting_id', newSublisting.id);

			if (deleteError) {
				console.error('Error deleting sublisting subtags:', deleteError);
				throw new InternalServerError(
					'Error with sublisting subtag deletion. Contact Support.'
				);
			}

			const sublistingSubtags = subtagIds.map((subtagId) => ({
				sublisting_id: newSublisting.id,
				subtag_id: subtagId,
			}));

			const { error: subtagsError } = await supabase
				.from('sublistings_subtags')
				.insert(sublistingSubtags);

			if (subtagsError) {
				console.error('Error adding sublisting subtags:', subtagsError);
				throw new InternalServerError(
					'Error with sublisting subtag addition. Contact Support.'
				);
			}
		} else {
			if (!isValidUUID(validatedFields.data.id)) {
				console.error('Invalid fields uuid to handle sublisting update.');
				throw new BadRequestError(
					'Invalid fields uuid to handle sublisting update. Contact Support.'
				);
			}
			const { data: updatedSublisting, error: sublistingError } = await supabase
				.from('sublistings')
				.update({
					...validatedFields.data,
					slug:
						stringToSlug(validatedFields.data.title) +
						'-' +
						validatedFields.data.listing_id.slice(0, 8),
					...(needsEmbeddings
						? { embedding: JSON.stringify(sublistingEmbeddings) }
						: {}),
					updated_at: new Date().toISOString(),
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (sublistingError || !updatedSublisting.id) {
				console.error('Error updating sublisting:', sublistingError);
				throw new InternalServerError(
					'Error with sublisting id. Contact Support.'
				);
			}

			const { error: deleteError } = await supabase
				.from('sublistings_subtags')
				.delete()
				.eq('sublisting_id', updatedSublisting.id);

			if (deleteError) {
				console.error(
					'Error while updating sublisting subtags:',
					sublistingError
				);
				throw new InternalServerError(
					'Error while updating the sublisting subtags. Contact Support.'
				);
			}

			const sublistingSubtags = subtagIds.map((subtagId) => ({
				sublisting_id: updatedSublisting.id,
				subtag_id: subtagId,
			}));

			const { error: subtagsError } = await supabase
				.from('sublistings_subtags')
				.insert(sublistingSubtags);

			if (subtagsError) {
				console.error(
					'Error while adding new sublisting subtags:',
					subtagsError
				);
				throw new InternalServerError(
					'Error while updating the sublisting subtags. Contact Support.'
				);
			}
		}

		revalidatePath('/', 'layout');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
