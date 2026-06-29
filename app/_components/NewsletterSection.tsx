'use client';

// Import Types
// Import External Packages
import Iframe from 'react-iframe';
import Link from 'next/link';
// Import Components
import { CookieConsentButton_Accept } from '@/components/CookieConsentBanner';
import {
	SubSectionContentContainer,
	SubSectionInnerContainer,
	SubSectionOuterContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import { useCookieConsent } from '@/state/useCookieConsent';
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

/**
 * Renders a newsletter subscription box powered by BeeHiiv.
 *
 * @param size - The size of the newsletter box. Defaults to 'lg'.
 * @param className - Additional CSS class for the container element.
 * @param title - The title of the newsletter box.
 * @param description - The description of the newsletter box.
 * @param disclaimer - The disclaimer text of the newsletter box.
 * @param textForPrivacyPolicy - The text for the privacy policy link. Defaults to 'Read our privacy policy'.
 * @param linkToPrivacyPolicy - The URL of the privacy policy page. Defaults to '/privacy-policy'.
 * @returns The rendered newsletter subscription box.
 */
export default function NewsletterBox_BeeHiiv({
	size = 'lg',
	className,
	title = 'JOIN THE FAMILY',
	description = 'Subscribe for the latest stories and the freshest deals in your inbox.',
	disclaimer = 'We care about your data.',
	textForPrivacyPolicy = 'Read our privacy policy',
	linkToPrivacyPolicy = '/privacy-policy',
}: {
	size?: 'sm' | 'lg';
	className?: string;
	title?: string;
	description?: string;
	disclaimer?: string;
	textForPrivacyPolicy?: string;
	linkToPrivacyPolicy?: string;
}) {
	const { hasCookieConsent } = useCookieConsent();
	const beeHiivEmbedUrl = process.env.NEXT_PUBLIC_BEEHIIV_EMBED_URL;

	if (!beeHiivEmbedUrl) {
		return null;
	}

	/**
	 * Size=sm will render the NewsletterBox component with a small size, i.e. just the box.
	 */
	if (size === 'sm') {
		return (
			<div id="newsletter" className={className}>
				{hasCookieConsent === true ? (
					<Iframe url={beeHiivEmbedUrl} data-test-id="beehiiv-embed" />
				) : (
					<CookieConsentButton_Accept buttonText="Accept Cookies to display" />
				)}
			</div>
		);
	}

	/**
	 * Size=lg will render the NewsletterBox Section with a large size, with title, description and full disclaimer.
	 */
	return (
		<div
			id="newsletter"
			className={cn('w-full py-16 md:py-20', className)}
		>
			<div className="max-w-[720px] mx-auto px-4 sm:px-6">
				<div className="bg-white dark:bg-card rounded-[28px] border border-border/60 p-12 md:p-14 text-center">
					<h2 className="text-[26px] md:text-[32px] font-bold tracking-tight text-foreground mb-3">
						{title}
					</h2>
					<p className="text-[15px] text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
						{description}
					</p>
					<div className="w-full max-w-sm mx-auto">
						{hasCookieConsent === true ? (
							<Iframe
								title="Newsletter Signup"
								url={beeHiivEmbedUrl}
								data-test-id="beehiiv-embed"
								className="h-[60px] overflow-hidden w-full bg-transparent"
							/>
						) : (
							<CookieConsentButton_Accept
								buttonText="Accept Cookies to display Newsletter Signup"
								className="h-11 w-full rounded-full"
								variant="default"
							/>
						)}
					</div>
					<p className="mt-5 text-[12px] text-text-secondary/70">
						{disclaimer}{' '}
						<Link
							href={linkToPrivacyPolicy}
							className="hover:text-foreground transition-colors underline underline-offset-2"
						>
							{textForPrivacyPolicy}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

