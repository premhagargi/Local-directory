'use server';

// Import Types
// Import External Packages
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
import { isValidUUID } from '@/lib/utils';
// Import Data
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

const AdFormSchema = z.object({
	id: z.optional(z.string()),
	name: z.string().min(2, { message: 'Should at least 2 characters long' }),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
	invoice_id: z.string().optional(),
	price: z
		.number({ coerce: true })
		.min(0, { message: 'Price cannot be negative' })
		.optional(),
	contact_name: z
		.string()
		.min(2, { message: 'Should at least 2 characters long' })
		.optional(),
	contact_email: z.string().email().optional(),
	redirect_url: z.string().url(),
	image_url: z.string(),
	slot_name: z.string().optional(),
});

/**
 * Upserts an ad campaign into the database.
 *
 * @param formData - The form data for the ad campaign.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertAd(
	formData: z.infer<typeof AdFormSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
			checkAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error.');
		}

		const validatedFields = AdFormSchema.safeParse(formData);

		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const supabase = createSupabaseRLSClient();

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			delete validatedFields.data.id;
			const { data: newAd, error: adError } = await supabase
				.from('ad_campaigns')
				.insert({
					...validatedFields.data,
					start_date: validatedFields.data.start_date.toISOString(),
					end_date: validatedFields.data.end_date.toISOString(),
				})
				.select('id')
				.single();

			if (adError || !newAd.id) {
				console.error('Error upserting ad:', adError);
				throw new InternalServerError('Error with ad id. Contact Support.');
			}
		} else {
			if (!isValidUUID(validatedFields.data.id)) {
				console.error('Invalid fields uuid to handle ad update.');
				throw new BadRequestError(
					'Invalid fields uuid to handle ad update. Contact Support.'
				);
			}
			const { data: updatedAd, error: adError } = await supabase
				.from('ad_campaigns')
				.update({
					...validatedFields.data,
					start_date: validatedFields.data.start_date.toISOString(),
					end_date: validatedFields.data.end_date.toISOString(),
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (adError || !updatedAd.id) {
				console.error('Error upserting ad:', adError);
				throw new InternalServerError('Error with ad id. Contact Support.');
			}
		}
		revalidateTag('ads');
		revalidatePath('/', 'layout');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
