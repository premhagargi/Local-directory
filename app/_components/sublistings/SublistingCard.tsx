// Import Types
import { SublistingType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import PriceDisplay from './PriceDisplay';
import { StarRating } from '@/components/sublistings/StarRating';
import SupabaseImage from '@/components/SupabaseImage';
import {
	ImageCard,
	ImageCardDescription,
	ImageCardFooter,
	ImageCardImageContainer,
	ImageCardLink,
	ImageCardTitle,
	ImageCardBanner,
} from '@/ui/ImageCard';
// Import Functions & Actions & Hooks & State
import { cn } from '@/utils';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
import { BadgePercentIcon } from 'lucide-react';
// Import Assets & Icons

/**
 * A card component that displays a sublisting.
 * @param sublisting - The sublisting to display.
 * @param settings - The settings for the card.
 */
export default function SublistingCard({
	sublisting,
	showAsRow,
}: {
	sublisting: SublistingType;
	showAsRow?: boolean;
}) {
	return (
		<ImageCard
			linkHover
			className="border-1 border-transparent fade-in bg-transparent shadow-none group "
		>
			<ImageCardImageContainer
				className={cn(
					'rounded-lg aspect-square',
					showAsRow ? 'w-52 md:w-auto' : 'w-auto'
				)}
			>
				<SupabaseImage
					dbImageUrl={sublisting.default_image_url}
					width={1600}
					height={900}
					database="sublisting_images"
					priority={true}
					className="group-hover:scale-105 transition-transform duration-300 h-full w-full"
				/>

				{!sublisting.availability && (
					<ImageCardBanner className="flex gap-2 bg-transparent" location="tl">
						<span className="bg-black text-white rounded-lg w-fit px-2 py-1 font-medium text-base">
							Sold Out
						</span>
					</ImageCardBanner>
				)}

				{sublisting.availability && !!sublisting.price_promotional_in_cents ? (
					<ImageCardBanner className="flex gap-2 bg-transparent" location="tl">
						<span className="bg-light-red-bg text-text-on-light-red rounded-lg w-fit px-2 py-1 font-medium text-base">
							Sale
						</span>
					</ImageCardBanner>
				) : null}

				<ImageCardBanner className="flex gap-2 bg-transparent" location="tr">
					{sublisting.is_promoted && (
						<span className="bg-green-400/60 text-green-800 rounded-xl w-fit px-1 text-sm tracking-tight">
							Promoted
						</span>
					)}
					{GENERAL_SETTINGS.USE_RATING_ON_CARD &&
					sublisting.average_rating &&
					sublisting.average_rating > 0 ? (
						<span className="bg-green-600 text-white rounded-sm w-fit px-1 text-sm tracking-tight">
							<StarRating
								rating={sublisting.average_rating}
								maxRating={5}
								numberOfStars={1}
							/>
						</span>
					) : null}
				</ImageCardBanner>

				<ImageCardLink
					href={`/products/${sublisting.slug}`}
					data-umami-event="Sublisting Card"
					data-umami-event-sublisting={sublisting.slug}
				/>
			</ImageCardImageContainer>

			<ImageCardFooter className="flex flex-col relative w-full overflow-hidden bg-transparent p-0 pt-2">
				<ImageCardLink
					href={`/products/${sublisting.slug}`}
					data-umami-event="Sublisting Card"
					data-umami-event-sublisting={sublisting.slug}
				/>
				<div className="flex justify-between items-center h-7 overflow-hidden w-full">
					<ImageCardTitle className="whitespace-nowrap">
						{sublisting.title}
					</ImageCardTitle>
					{/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */}
					{!!sublisting.owner.discount_code_percentage && (
						<div className="bg-light-red-bg text-text-on-light-red whitespace-nowrap h-fit p-1 rounded-md text-sm font-medium items-center hidden md:flex">
							<BadgePercentIcon size={14} className="mr-1" />{' '}
							{/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */}
							{sublisting.owner.discount_code_percentage}% Off
						</div>
					)}
				</div>
				<PriceDisplay sublisting={sublisting} />
				{/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */}
				<ImageCardDescription>{sublisting.owner.title}</ImageCardDescription>
			</ImageCardFooter>
		</ImageCard>
	);
}
