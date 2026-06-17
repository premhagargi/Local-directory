// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
import Navbar_Public from '@/components/Navbar_Public';
// Import Functions & Actions & Hooks & State
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants'; // Import Assets & Icons

// https://nextjs.org/docs/app/api-reference/file-conventions/not-found

export default function NotFound() {
	return (
		<section className="min-h-screen">
			<Navbar_Public />
			<div className="w-full py-14">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="font-semibold text-2xl">
						Sorry, we could not find this page.{' '}
					</h2>
					<p className="font-extrabold text-7xl py-12">404</p>
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
	);
}
