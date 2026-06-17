'use client';

// Import Types
// Import External Packages
//@ts-ignore
import { loadStripe } from '@stripe/stripe-js';
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { Suspense } from 'react';
// Import Components
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

export default function StripeCheckout({
	stripeClientSecret,
	abortFunction,
}: {
	stripeClientSecret: string;
	abortFunction: (arg0: null) => void;
}) {
	const stripePromise = loadStripe(
		process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
	);

	if (!stripeClientSecret || !stripePromise) {
		<p>
			Error. Please refresh the page or contact support:{' '}
			{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}.
		</p>;
	}
	return (
		<Card className="py-8">
			<div className="w-full flex justify-center py-8">
				<Button
					variant="outline"
					className="font-semibold"
					onClick={() => abortFunction(null)}
				>
					Back to Listing & Date Selection
				</Button>
			</div>

			<Suspense fallback={<div>Loading...</div>}>
				<div id="checkout" className="py-2">
					<EmbeddedCheckoutProvider
						stripe={stripePromise}
						options={{ clientSecret: stripeClientSecret }}
					>
						<EmbeddedCheckout />
					</EmbeddedCheckoutProvider>
				</div>
			</Suspense>
		</Card>
	);
}
