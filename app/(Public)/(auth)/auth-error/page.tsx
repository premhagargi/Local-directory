// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

export default function AuthErrorPage() {
	return (
		<div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-md text-center">
				<div className="mx-auto h-12 w-12 text-primary" />
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Authentication Error
				</h1>
				<p className="mt-4 text-muted-foreground">
					We&apos;re sorry, but there was a problem with your authentication.
					Please try again. If the issue persists, please contact our support
					team at
					<span className="font-medium">
						{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}
					</span>
					.
				</p>
				<div className="mt-6">
					<Link
						href="/"
						className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
						prefetch={false}
					>
						Return Home
					</Link>
				</div>
			</div>
		</div>
	);
}
