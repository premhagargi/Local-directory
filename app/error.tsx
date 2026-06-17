'use client';

// Import Types
// Import External Packages
import { useEffect } from 'react';
import Link from 'next/link';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants'; // Import Assets & Icons

/**
 * A component that displays an error message.
 * @param error - The error to display.
 * @param reset - The function to reset the error.
 */
export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<section className="min-h-screen">
			<div className="w-full py-14">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="font-semibold text-2xl">Something went wrong! </h2>
					<p className="font-extrabold text-7xl py-12">Oooops..</p>
					<p className="text-muted-foreground text-lg italic py-4">
						If this error persists, please contact us at{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}.
					</p>
					<div className="grid gap-y-8">
						<button onClick={() => reset()}>Try again</button>
						<Link href="/" className="underline text-primary text-lg">
							Return Home
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
