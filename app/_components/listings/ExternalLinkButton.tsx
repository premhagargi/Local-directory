'use client';

// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import ExternalLink from '@/ui/ExternalLink';
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import incrementStatCounters from '@/actions/listings/incrementStatCounters';
import insertActivity from '@/actions/activites/insertActivity';
import { cn } from '@/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

/**
 * A button component that opens an external link to a listing.
 * @param listing - The listing to link to.
 * @param textVariant - The text variant (1: Website, 2: Title of Company) to display on the button.
 * @param className - The class name to apply to the button.
 */
export default function ExternalLinkButton({
	listing,
	textVariant = 1,
	className,
}: {
	listing: ListingType;
	textVariant?: number;
	className?: string;
}) {
	if (!listing?.click_url) return null;

	const referral = COMPANY_BASIC_INFORMATION.URL.replace('https://', '');

	return (
		<ExternalLink
			href={listing.click_url + `?ref=${referral}`}
			className={cn(
				buttonVariants({ variant: 'default', size: 'lg' }),
				'text-lg',
				className
			)}
			trusted
			follow
			onClick={async () => {
				GENERAL_SETTINGS.USE_CLICK
					? await incrementStatCounters(listing.id, 'clicks')
					: null;
				await insertActivity('new_click', listing.title);
			}}
			data-umami-event="External Link Clicked"
			data-umami-event-listing={listing.slug}
		>
			Visit
			<span className="hidden md:block pl-1">
				{textVariant === 1 ? 'Website' : listing.title}
			</span>
		</ExternalLink>
	);
}
