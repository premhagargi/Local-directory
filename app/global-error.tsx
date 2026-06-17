'use client';

// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants'; // Import Assets & Icons

// https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs

export default function GlobalError() {
	return (
		<html>
			<body className="text-center">
				<section className="min-h-screen">
					<div className="w-full py-14">
						<div className="max-w-2xl mx-auto text-center">
							<h2 className="font-semibold text-2xl">Something went wrong!</h2>
							<p className="font-extrabold text-7xl py-12">Oooops...</p>
							<p className="text-muted-foreground text-lg italic py-4">
								If this error persists, please contact us at{' '}
								{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}.
							</p>
							<Link href="/" className="underline text-primary text-lg">
								Return Home
							</Link>
						</div>
					</div>
				</section>
			</body>
		</html>
	);
}
