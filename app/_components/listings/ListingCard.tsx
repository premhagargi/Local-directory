// Import Types
import { ListingType, AuthUserType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
import Link from 'next/link';
import ListingCardCoupon from '@/components/listings/ListingCardCoupon';
// Import Functions & Actions & Hooks & State
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

// Fallback screenshots for dummy/seed listings that have no image yet.
const FALLBACK_LISTING_IMAGES = [
	'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1191&h=792&q=80',
	'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1191&h=792&q=80',
	'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1191&h=792&q=80',
	'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1191&h=792&q=80',
	'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1191&h=792&q=80',
	'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1191&h=792&q=80',
];

// Pick a stable fallback image based on the listing so it doesn't change on re-render.
function getFallbackImage(seed: string) {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
	}
	return FALLBACK_LISTING_IMAGES[hash % FALLBACK_LISTING_IMAGES.length];
}

/**
 * A card component that displays a listing.
 * AppStacks-inspired: large image tile, app icon + name + tagline below.
 * @param listing - The listing to display.
 * @param user - The authenticated user (optional).
 */
export default function ListingCard({
	listing,
	user,
}: {
	listing: ListingType;
	user: AuthUserType | null;
}) {
	const screenshotUrl =
		listing.default_image_url ||
		getFallbackImage(listing.slug || listing.title || 'listing');
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

			{/* Screenshot Container — AppStacks large image tile */}
			<div className="relative w-full rounded-[14px] overflow-hidden mb-3 border border-gray-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 aspect-[397/264] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
				<SupabaseImage
					dbImageUrl={screenshotUrl}
					width={1191}
					height={792}
					database="listing_images"
					priority
					className="w-full h-full object-cover"
				/>

				{/* Status badges — top right */}
				<div className="absolute top-2.5 right-2.5 flex gap-1.5 z-20">
					{listing.created_at && isNew && (
						<span className="bg-white/90 backdrop-blur-sm text-foreground font-semibold rounded-full px-2.5 py-0.5 text-[11px] border border-white/50 shadow-sm">
							New release
						</span>
					)}
					{listing.is_promoted && (
						<span className="bg-white/90 backdrop-blur-sm text-foreground font-semibold rounded-full px-2.5 py-0.5 text-[11px] border border-white/50 shadow-sm">
							Featured
						</span>
					)}
				</div>
			</div>

			{/* App info row — AppStacks: icon + title + tagline */}
			<div className="flex items-start gap-2.5 relative z-20 pointer-events-none">
				{/* App Icon */}
				{listing.logo_image_url ? (
					<div className="w-9 h-9 rounded-[9px] overflow-hidden bg-white flex-shrink-0 border border-border/60 shadow-sm">
						<SupabaseImage
							dbImageUrl={listing.logo_image_url}
							width={36}
							height={36}
							database="listing_images"
							priority={false}
							className="w-full h-full object-cover"
						/>
					</div>
				) : (
					<div className="w-9 h-9 rounded-[9px] bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 border border-border/40">
						<span className="text-sm font-bold text-foreground">{listing.title.charAt(0)}</span>
					</div>
				)}

				{/* Title + Tagline */}
				<div className="min-w-0 flex-grow pt-0.5">
					<h3 className="text-[15px] font-medium text-foreground line-clamp-1 leading-tight">
						{listing.title}
					</h3>
					<p className="text-[13px] text-gray-600 line-clamp-1 mt-0.5 leading-snug">
						{(listing as any).tagline || listing.excerpt || listing.description}
					</p>
				</div>
			</div>
		</div>
	);
}
