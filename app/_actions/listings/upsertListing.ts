'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import generateEmbeddings from '@/actions/listings/generateEmbeddings';
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

const ListingFormSchema = z.object({
	id: z.optional(z.string()),
	title: z.string().min(2, { message: 'Should at least 2 characters long' }),
	excerpt: z
		.string()
		.min(20, { message: 'Should be at least 20 characters long' })
		.max(160, { message: 'Should beat most 160 characters long' }),
	description: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
	category_id: z.string().min(2, { message: 'Category is missing.' }),
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
	discount_code_text: z.string().optional(),
	discount_code_percentage: z.string().optional(),
	discount_code: z.string().optional(),
	logo_image_url: z.string().optional(),
});

const ListingTagsSchema = z.array(z.string());

/**
 * Upserts a listing with the provided form data, tag IDs, and embeddings flag.
 *
 * @param formData - The form data for the listing.
 * @param tagIds - The tag IDs for the listing.
 * @param needsEmbeddings - A flag indicating whether embeddings are needed for the listing.
 * @returns A promise that resolves to a server response containing the upserted listing.
 */
export default async function upsertListing(
	formData: z.infer<typeof ListingFormSchema>,
	tagIds: z.infer<typeof ListingTagsSchema>,
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

		const validatedFields = ListingFormSchema.safeParse(formData);

		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const validatedTags = ListingTagsSchema.safeParse(tagIds);

		if (!validatedTags.success) {
			throw new HookFormError(validatedTags.error.flatten().fieldErrors);
		}

		const supabase = createSupabaseRLSClient();

		let listingEmbeddings: number[] = [];

		if (needsEmbeddings) {
			const { data: newListingEmbeddings } = await generateEmbeddings({
				title: validatedFields.data.title,
				description: validatedFields.data.description,
				excerpt: validatedFields.data.excerpt,
			});
			listingEmbeddings = newListingEmbeddings;
		}

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			const adminApproved =
				validatedFields.data.is_admin_published === true
					? true
					: GENERAL_SETTINGS.PRE_ADMIN_APPROVE_LISTINGS;
			delete validatedFields.data.id;
			delete validatedFields.data.is_admin_published;

			const { data: newListing, error: listingError } = await supabase
				.from('listings')
				.insert({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.title),
					finder_id: user.id,
					embedding: JSON.stringify(listingEmbeddings),
					is_admin_published: adminApproved,
				})
				.select('id')
				.single();

			if (listingError || !newListing.id) {
				console.error('Error upserting listing:', listingError);
				const typeError = listingError?.message.includes('duplicate key value')
					? 'A listing with this name already exsist. Check if the listing you want to include already exists. If not consider changing the name please.'
					: 'Unknown Error. Please contact support.';
				throw new InternalServerError(typeError);
			}

			const { error: deleteError } = await supabase
				.from('listings_tags')
				.delete()
				.eq('listing_id', newListing.id);

			if (deleteError) {
				console.error('Error deleting listing tags:', deleteError);
				throw new InternalServerError(
					'Error with listing tag deletion. Contact Support.'
				);
			}

			const listingTags = tagIds.map((tagId) => ({
				listing_id: newListing.id,
				tag_id: tagId,
			}));

			const { error: tagsError } = await supabase
				.from('listings_tags')
				.insert(listingTags);

			if (tagsError) {
				console.error('Error adding listing tags:', tagsError);
				throw new InternalServerError(
					'Error with listing tag addition. Contact Support.'
				);
			}
		} else {
			if (!isValidUUID(validatedFields.data.id)) {
				console.error('Invalid fields uuid to handle listing update.');
				throw new BadRequestError(
					'Invalid fields uuid to handle listing update. Contact Support.'
				);
			}
			const { data: updatedListing, error: listingError } = await supabase
				.from('listings')
				.update({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.title),
					...(needsEmbeddings
						? { embedding: JSON.stringify(listingEmbeddings) }
						: {}),
					updated_at: new Date().toISOString(),
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (listingError || !updatedListing.id) {
				console.error('Error updating listing:', listingError);
				throw new InternalServerError(
					'Error with listing id. Contact Support.'
				);
			}

			const { error: deleteError } = await supabase
				.from('listings_tags')
				.delete()
				.eq('listing_id', updatedListing.id);

			if (deleteError) {
				console.error('Error while updating listing tags:', listingError);
				throw new InternalServerError(
					'Error while updating the listing tags. Contact Support.'
				);
			}

			const listingTags = tagIds.map((tagId) => ({
				listing_id: updatedListing.id,
				tag_id: tagId,
			}));

			const { error: tagsError } = await supabase
				.from('listings_tags')
				.insert(listingTags);

			if (tagsError) {
				console.error('Error while adding new listing tags:', tagsError);
				throw new InternalServerError(
					'Error while updating the listing tags. Contact Support.'
				);
			}
		}

		revalidatePath('/', 'layout');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
