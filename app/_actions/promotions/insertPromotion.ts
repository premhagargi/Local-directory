'use server';

// Import Types
// Import External Packages
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
import {
	UnauthorizedError,
	InternalServerError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
} from '@/lib/handlingServerResponses';
import { revalidatePath } from 'next/cache';
// Import Data
// Import Assets & Icons

const PromtionFormSchema = z.object({
	listingId: z
		.string()
		.min(2, { message: 'Should at least 2 characters long' }),
	categoryId: z.string(),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
	stripe_checkout_id: z.string(),
	stripe_payment_intent: z.string(),
	price: z.number().min(0, { message: 'Price cannot be negative' }),
});

/**
 * Inserts a new promotion into the database.
 *
 * @param formData - The form data for the promotion.
 * @returns A promise that resolves to a server response.
 */
export default async function insertPromotion(
	formData: z.infer<typeof PromtionFormSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = PromtionFormSchema.safeParse(formData);

		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const { user, error: authError } = await serverAuth({
			checkUser: true,
			mustBeSignedIn: true,
		});

		if (!user || authError) {
			throw new UnauthorizedError('Auth Error.');
		}

		const supabase = createSupabaseRLSClient();

		const { data: newPromotion, error: promotionError } = await supabase
			.from('promotions')
			.insert({
				listing_id: validatedFields.data.listingId,
				profile_id: user.id,
				category_id: validatedFields.data.categoryId,
				start_date: validatedFields.data.start_date.toISOString(),
				end_date: validatedFields.data.end_date.toISOString(),
				price: validatedFields.data.price,
				stripe_checkout_id: validatedFields.data.stripe_checkout_id,
				stripe_payment_intent: validatedFields.data.stripe_payment_intent,
				is_paid: true,
			})
			.select('id')
			.single();

		if (!newPromotion || promotionError) {
			console.error('Error with promotion id.:', promotionError);
			throw new InternalServerError(
				'Error with promotion id. Contact Support.'
			);
		}
		revalidatePath('/', 'layout');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
