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

function InternalLinkBar({
	linkList,
}: {
	linkList: typeof FOOTER_NAVIGATION_LINKS;
}) {
	return (
		<div
			className={cn(
				'mt-16 grid grid-cols-2 gap-8 xl:mt-0 col-span-2',
				`lg:grid-cols-${Object.keys(linkList).length}`
			)}
		>
			{Object.keys(linkList).map((category) => (
				<div key={category}>
					<h3 className="text-sm font-semibold leading-6 text-foreground">
						{capitalize(category)}
					</h3>
					<ul role="list" className="mt-6 space-y-4">
						{linkList[category].map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className="text-sm leading-6 text-muted-foreground hover:underline"
								>
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
			className="relative w-full pt-10 z-20 bg-background-secondary"
			aria-labelledby="footer-heading"
		>
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-4 lg:px-12 pt-16">
				<div className="md:grid md:grid-cols-4 xl:gap-8">
					<div className="pr-12 col-span-2">
						<Image
							className="h-auto w-48 dark:hidden"
							src="/logos/logo_for_light.png"
							width={150}
							height={100}
							alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo Dark on transparent background`}
						/>
						<Image
							className="h-auto w-48 hidden dark:block"
							src="/logos/logo_for_dark.png"
							width={150}
							height={100}
							alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo White on transparent background`}
						/>
						<p className="text-sm leading-6 text-muted-foreground py-6">
							{FOOTER_SLOGAN}
						</p>

						<SocialFollowBar
							className="text-sm text-foreground"
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
