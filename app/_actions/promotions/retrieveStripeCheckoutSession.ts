'use server';

// Import Types
// Import External Packages
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Import Components
// Import Functions & Actions & Hooks & State
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
import {
	BadRequestError,
	UnauthorizedError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Assets & Icons

/**
 * Retrieves a Stripe checkout session.
 *
 * @param session_id - The ID of the checkout session to retrieve.
 * @returns A Promise that resolves to the retrieved checkout session.
 */
export default async function retrieveStripeCheckoutSession(
	session_id: string | string[] | undefined
) {
	try {
		if (!session_id) {
			throw new BadRequestError('Invalid fields to retrieve checkout session.');
		}
		const { user, error: authError } = await serverAuth({
			checkUser: true,
			mustBeSignedIn: true,
		});

		if (!user || authError) {
			throw new UnauthorizedError('Auth Error.');
		}

		const session = await stripe.checkout.sessions.retrieve(session_id);

		if (!session) {
			console.error('Error retrieving stripe checkout session!');
			throw new InternalServerError(
				'Error retrieving stripe checkout session!'
			);
		}
		return handleServerSuccess(JSON.parse(JSON.stringify(session)));
	} catch (error) {
		return handleServerError(error, {});
	}
}
