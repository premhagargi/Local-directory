'use client';

// Import Types
import { SublistingType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import ExternalLink from '@/ui/ExternalLink';
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import incrementStatCounters from '@/actions/sublistings/incrementStatCounters';
import insertActivity from '@/actions/activites/insertActivity';
import { cn } from '@/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

/**
 * A button component that opens an external link to a sublisting.
 * @param sublisting - The sublisting to link to.
 * @param textVariant - The text variant (1: Website, 2: Title of Company) to display on the button.
 * @param className - The class name to apply to the button.
 */
export default function ExternalLinkButton({
	sublisting,
	className,
	type,
}: {
	sublisting: SublistingType;
	className?: string;
	type: 'listing' | 'product';
}) {
	if (!sublisting?.click_url) return null;

	const referral = COMPANY_BASIC_INFORMATION.URL.replace('https://', '');

	return (
		<ExternalLink
			href={
				/* @ts-ignore */
				(type === 'listing'
					? /* @ts-ignore */
					  sublisting.owner.click_url
					: sublisting.click_url) + `?ref=${referral}`
			}
			className={cn(
				buttonVariants({
					variant: type === 'listing' ? 'default' : 'outline',
					size: 'lg',
				}),
				type === 'listing' && 'dark:bg-primary',
				className
			)}
			trusted
			follow
			onClick={async () => {
				GENERAL_SETTINGS.USE_CLICK
					? await incrementStatCounters(sublisting.id, 'clicks')
					: null;
				await insertActivity('new_click', sublisting.title);
			}}
			data-umami-event="External Link Clicked"
			data-umami-event-sublisting={
				/* @ts-ignore */
				type === 'listing' ? sublisting.owner.click_url : sublisting.click_url
			}
		>
			{type === 'listing' ? 'See Listing' : 'Buy Now'}
		</ExternalLink>
	);
}
