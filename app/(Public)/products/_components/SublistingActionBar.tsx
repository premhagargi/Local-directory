// Import Types
import { SublistingType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import SocialShareBar from '@/components/SocialShareBar';
import RatingDialog from '@/components/sublistings/Dialog_Rating';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

/**
 * Renders the ListingActionBar component.
 *
 * @param productMeta - The product metadata.
 * @param className - The optional CSS class name.
 * @returns The rendered ListingActionBar component.
 */
export default async function SublistingActionBar({
	sublisting,
	className,
}: {
	sublisting: SublistingType;
	className?: string;
}) {
	if (!sublisting) return null;
	return (
		<div className={cn('flex justify-between py-2', className)}>
			{GENERAL_SETTINGS.USE_RATE && <RatingDialog sublisting={sublisting} />}

			{GENERAL_SETTINGS.USE_SOCIAL_SHARE && (
				<div className="flex items-center">
					<p className="text-sm mr-1">Share</p>
					<SocialShareBar
						title=""
						className="rounded-md bg-transparent"
						size="sm"
						currentSiteLink={`${
							COMPANY_BASIC_INFORMATION.URL
						}/products/${sublisting.slug!}`}
					/>
				</div>
			)}
		</div>
	);
}
