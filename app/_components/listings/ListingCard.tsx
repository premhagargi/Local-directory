// Import Types
import { ListingType, AuthUserType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
import Link from 'next/link';
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
		<div className="group relative flex flex-col fade-in">
			<Link href={`/explore/${listing.slug}`} className="absolute inset-0 z-10">
				<span className="sr-only">View {listing.title}</span>
			</Link>
			
			{/* Screenshot Container - Large rounded like AppStacks */}
			<div className="relative w-full rounded-2xl overflow-hidden mb-4 bg-neutral-200 dark:bg-neutral-800 aspect-[4/3]">
				<SupabaseImage
					dbImageUrl={listing.default_image_url}
					width={800}
					height={600}
					database="listing_images"
					priority
					className="w-full h-full object-cover"
				/>

				{/* Status badges inside top-right like AppStacks */}
				<div className="absolute top-3 right-3 flex gap-2 z-20">
					{listing.created_at && isNew && (
						<span className="bg-white/90 backdrop-blur-sm text-foreground font-medium rounded-full px-3 py-1 text-xs border border-border/50">
							New release
						</span>
					)}
					{listing.is_promoted && (
						<span className="bg-white/90 backdrop-blur-sm text-foreground font-medium rounded-full px-3 py-1 text-xs border border-border/50">
							Featured
						</span>
					)}
				</div>
			</div>

			{/* App info row - Icon + Title + Tagline (AppStacks style) */}
			<div className="flex items-start gap-3 relative z-20 pointer-events-none">
				{/* App Icon */}
				{listing.logo_image_url ? (
					<div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-border/50">
						<SupabaseImage
							dbImageUrl={listing.logo_image_url}
							width={40}
							height={40}
							database="listing_images"
							className="w-full h-full object-cover"
						/>
					</div>
				) : (
					<div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
						<span className="text-sm font-bold text-foreground">{listing.title.charAt(0)}</span>
					</div>
				)}

				{/* Title + Tagline */}
				<div className="min-w-0 flex-grow">
					<h3 className="text-base font-bold text-foreground line-clamp-1 leading-snug">
						{listing.title}
					</h3>
					<p className="text-sm text-text-secondary line-clamp-1 mt-0.5">
						{listing.tagline || listing.excerpt || listing.description}
					</p>
				</div>
			</div>
		</div>
	);
}
