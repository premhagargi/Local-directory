// Purpose: Handle Stripe webhooks for checkout.session.completed events

// Import Types
// Import External Packages
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
// Import Components
// Import Functions & Actions & Hooks & State
import updatePaymentWithReceiptURL from '@/actions/promotions/updatePaymentWithReceiptURL';
// Import Data
// Import Assets & Icons

export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get('Stripe-Signature') as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (error: any) {
		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
	}

	switch (event.type) {
		case 'charge.succeeded':
			const paymentIntent = event.data.object.payment_intent;
			const receiptUrl = event.data.object.receipt_url;

			if (!paymentIntent || !receiptUrl) {
				return new NextResponse(`Webhook Error: Missing Data`, { status: 400 });
			}

			const { error, success } = await updatePaymentWithReceiptURL(
				receiptUrl,
				paymentIntent as string
			);
			if (!success) {
				return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
			}
			break;
		default:
			console.error(`Unhandled event type ${event.type}`);
	}

	return new NextResponse(null, { status: 200 });
}
