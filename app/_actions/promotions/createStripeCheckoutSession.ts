'use server';
// Import Types
// Import External Packages
import { differenceInDays } from 'date-fns';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
import { PROMOTIONS_DATA, COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
// Import Error Handling
import {
	UnauthorizedError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	InternalServerError,
} from '@/lib/handlingServerResponses';

const PromtionFormSchema = z.object({
	listingId: z
		.string()
		.min(2, { message: 'Should at least 2 characters long' }),
	categoryId: z.string(),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
	price: z.number().min(0, { message: 'Price cannot be negative' }),
});

/**
 * Creates a Stripe checkout session for promoting a listing.
 *
 * @param formData - The form data containing the promotion details.
 * @returns A promise that resolves to the server response.
 */
export default async function createStripeCheckoutSession(
	formData: z.infer<typeof PromtionFormSchema>
) {
	try {
		if (!process.env.STRIPE_SECRET_KEY) {
			throw new InternalServerError('Payments not configured.');
		}

		const { user, error } = await serverAuth({
			checkUser: true,
			mustBeSignedIn: true,
		});

		if (!user || error) {
			throw new UnauthorizedError('Auth Error.');
		}

		const validatedFields = PromtionFormSchema.safeParse(formData);

		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const days = differenceInDays(formData.end_date, formData.start_date) + 1;

		const session = await stripe.checkout.sessions.create({
			ui_mode: 'embedded',
			payment_method_types: ['card'],
			customer_email: user.email,
			customer_creation: 'always',
			mode: 'payment',
			line_items: [
				{
					price: PROMOTIONS_DATA.STRIPE_PRICE_ID,
					quantity: days,
				},
			],
			metadata: {
				listingId: formData.listingId,
				categoryId: formData.categoryId,
				start_date: formData.start_date,
				end_date: formData.end_date,
				price: formData.price,
			},
			discounts:
				days >= 30 ? [{ coupon: PROMOTIONS_DATA.STRIPE_COUPON_ID }] : [],
			allow_promotion_codes: true,
			automatic_tax: { enabled: true },
			tax_id_collection: { enabled: true },
			return_url: `${
				process.env.NODE_ENV === 'development'
					? 'http://localhost:3000'
					: COMPANY_BASIC_INFORMATION.URL
			}/account/promotions?success=true&session_id={CHECKOUT_SESSION_ID}`,
		});
		return handleServerSuccess({
			stripeClientSecret: session.client_secret as string,
		});
	} catch (error) {
		return handleServerError(error, {});
	}
}
