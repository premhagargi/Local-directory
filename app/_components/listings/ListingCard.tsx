// Import Types
import { ListingType, AuthUserType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
import {
	ImageCard,
	ImageCardFooter,
	ImageCardImageContainer,
	ImageCardLink,
	ImageCardTitle,
	ImageCardBanner,
} from '@/ui/ImageCard';
import ListingCardCoupon from '@/components/listings/ListingCardCoupon';
// Import Functions & Actions & Hooks & State
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { BadgeCheckIcon } from 'lucide-react';

/**
 * A card component that displays a listing.
 * @param listing - The listing to display.
 * @param settings - The settings for the card.
 */
export default function ListingCard({
	listing,
	user,
}: {
	listing: ListingType;
	user: AuthUserType | null;
}) {
	const isNew =
		new Date(listing.created_at || Date.now()) >
		new Date(
			Date.now() -
				GENERAL_SETTINGS.MAX_NUM_DAY_AGE_FOR_NEW_BADGE * 24 * 60 * 60 * 1000
		);
	return (
		<ImageCard
			linkHover
			className="border-1 border-transparent fade-in bg-transparent shadow-none group "
		>
			<ImageCardImageContainer className="rounded-lg aspect-video w-auto">
				<SupabaseImage
					dbImageUrl={listing.default_image_url}
					width={1600}
					height={900}
					database="listing_images"
					priority
					className="group-hover:scale-105 transition-transform duration-300 h-full w-full"
				/>

				<ImageCardBanner className="flex gap-2 bg-transparent" location="tr">
					{listing.is_promoted && (
						<span className="bg-green-400/60 text-green-800 rounded-sm w-fit px-1 text-sm tracking-tight">
							Promoted
						</span>
					)}
					{listing.created_at && isNew && (
						<span className="bg-light-red-bg text-text-on-light-red rounded-sm w-fit px-1 text-sm tracking-tight">
							New
						</span>
					)}
					{listing.owner_id && (
						<span className="bg-transparent">
							<BadgeCheckIcon className="h-5 w-5 text-green-500" />
						</span>
					)}
				</ImageCardBanner>

				<ImageCardLink
					href={`/explore/${listing.slug}`}
					data-umami-event="Listing Card"
					data-umami-event-listing={listing.slug}
				/>
			</ImageCardImageContainer>

			<ImageCardFooter className="flex flex-col relative w-full overflow-hidden bg-transparent p-0 pt-2">
				<ImageCardLink
					href={`/explore/${listing.slug}`}
					data-umami-event="Listing Card"
					data-umami-event-listing={listing.slug}
				/>

				<div className="relative w-full gap-x-2 flex text-sm items-center text-muted-foreground">
					{!!listing.category?.name && <p>{listing.category?.name}</p>}
				</div>

				<div className="flex justify-between h-14 overflow-hidden w-full">
					<ImageCardTitle>{listing.title}</ImageCardTitle>
					<ListingCardCoupon listing={listing} user={user} />
				</div>
			</ImageCardFooter>
		</ImageCard>
	);
}
