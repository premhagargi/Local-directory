'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import {
	BadRequestError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Updates the payment with the provided receipt URL.
 * @param receiptUrl - The URL of the receipt.
 * @param paymentIntent - The payment intent.
 * @returns A promise that resolves to the result of the update operation.
 */
export default async function updatePaymentWithReceiptURL(
	receiptUrl: string | undefined,
	paymentIntent: string | undefined
) {
	try {
		if (!receiptUrl || !paymentIntent) {
			throw new BadRequestError('Invalid fields to add receipt.');
		}

		const supabase = createSupabaseBrowserClient();

		const { data, error } = await supabase
			.from('promotions')
			.update({
				stripe_receipt_url: receiptUrl,
			})
			.eq('stripe_payment_intent', paymentIntent)
			.select('id')
			.single();

		if (error) {
			console.error('Error updating datanase with receipt:', error);
			throw new InternalServerError('Error updating database.');
		}
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
