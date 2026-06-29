// Import Types
// Import External Packages
import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
// Import Components
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { Toaster } from '@/ui/Toaster';
// Import Functions & Actions & Hooks & State
import createMetaData from '@/lib/createMetaData';
import FeedbackDialog from '@/components/feedback/Dialog_Feedback';
// Import Data
// Import Assets & Icons
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = createMetaData({});

/**
 * The root layout for the application.
 * @param children - The children to display in the layout.
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${inter.variable}`}>
			<Script
				defer
				src="https://analytics.eu.umami.is/script.js"
				data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
			></Script>
			<body className="bg-background text-foreground">
				<section className="min-h-screen">
					<main>{children}</main>
					<Toaster />
					<Suspense fallback={null}>
						<FeedbackDialog />
					</Suspense>
					<CookieConsentBanner />
				</section>
			</body>
		</html>
	);
}
