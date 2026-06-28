// Import Types
// Import External Packages
import Image from 'next/image';
import Link from 'next/link';
// Import Components
import SocialFollowBar from '@/components/SocialFollowBar';
// Import Functions & Actions & Hooks & State
import { capitalize, cn } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, FOOTER_SLOGAN } from '@/constants';
// Import Assets & Icons
// FIXED DATA

// What links do you want to show in the Footer?
const FOOTER_NAVIGATION_LINKS: {
	[key: string]: { label: string; href: string }[];
} = {
	resources: [
		{ label: 'All Listings', href: '/explore' },
		{ label: 'Blog', href: '/blog' },
		{ label: 'Advertise', href: '/advertise' },
	],
	legal: [
		{ label: 'Terms', href: '/terms' },
		{ label: 'Privacy', href: '/privacy-policy' },
		{ label: 'Cookies', href: '/cookie-policy' },
	],
};

function FooterCopyright() {
	const copyrightDuration =
		COMPANY_BASIC_INFORMATION.FOUNDING_YEAR ===
		new Date().getFullYear().toString()
			? COMPANY_BASIC_INFORMATION.FOUNDING_YEAR
			: `${COMPANY_BASIC_INFORMATION.FOUNDING_YEAR} - ${new Date()
					.getFullYear()
					.toString()}`;

	return (
		<div className="py-4 border-t border-neutral-300 mt-8 w-full">
			<div className="text-xs leading-5 text-muted-foreground whitespace-nowrap flex-wrap text-center mx-auto">
				&copy; {copyrightDuration} {COMPANY_BASIC_INFORMATION.NAME}. All rights
				reserved.{' '}
			</div>
		</div>
	);
}

function InternalLinkBar({ linkList }: { linkList: typeof FOOTER_NAVIGATION_LINKS; }) {
	return (
		<div className="grid grid-cols-2 gap-8 lg:gap-16">
			{Object.keys(linkList).map((category) => (
				<div key={category}>
					<h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
						{capitalize(category)}
					</h3>
					<ul role="list" className="space-y-3">
						{linkList[category].map((link) => (
							<li key={link.label}>
								<Link href={link.href} className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

/**
 * Renders the footer component.
 *
 * @returns The rendered footer component.
 */
export default function Footer() {
	return (
		<footer
			className="relative w-full pt-16 pb-8 z-20 bg-background border-t border-border mt-auto"
			aria-labelledby="footer-heading"
		>
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between gap-12">
					<div className="max-w-xs">
						<Link href="/">
							<Image
								className="h-8 w-auto dark:hidden"
								src="/logos/logo_for_light.png"
								width={150}
								height={100}
								alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo`}
							/>
							<Image
								className="h-8 w-auto hidden dark:block"
								src="/logos/logo_for_dark.png"
								width={150}
								height={100}
								alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo Dark`}
							/>
						</Link>
						<p className="mt-6 text-sm leading-relaxed text-text-secondary">
							{FOOTER_SLOGAN}
						</p>

						<SocialFollowBar
							className="text-foreground mt-6"
							direction="horizontal"
							size="sm"
						/>
					</div>

					<InternalLinkBar linkList={FOOTER_NAVIGATION_LINKS} />
				</div>

				<FooterCopyright />
			</div>
		</footer>
	);
}
