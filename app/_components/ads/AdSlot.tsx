// Import Types
// Import External Packages
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
import {
	ImageCard,
	ImageCardDescription,
	ImageCardFooter,
	ImageCardLink,
	ImageCardTitle,
	ImageCardTagGroup,
	ImageCardImageContainer,
	ImageCardBanner,
} from '@/ui/ImageCard';
// Import Functions & Actions & Hooks & State
import getAdByAdSlot from '@/actions/ads/getAdByAdSlot';
import { cn } from '@/lib/utils';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

/**
 * Renders an advertisement card component.
 *
 * @param slot - The slot for the advertisement.
 * @param className - The CSS class name for the component.
 * @returns The rendered advertisement card.
 */
export default async function AdSlot({
	slot,
	className,
}: {
	slot?: string;
	className?: string;
}) {
	if (GENERAL_SETTINGS.USE_ADS === false) return null;

	if (!slot)
		return (
			<ImageCard
				linkHover
				className={cn(
					'dark:border border-muted fade-in mt-12 shadow-none',
					className
				)}
			>
				<ImageCardFooter className="flex flex-col space-y-2 relative w-full overflow-hidden">
					<div className="relative w-full gap-x-2 flex overflow-x-hidden">
						<ImageCardTagGroup tags={[{ name: 'ad' }]} />
					</div>
					<ImageCardLink
						href={`/advertise`}
						data-umami-event="Ad Card"
						data-umami-event-ad="internal"
					/>
					<ImageCardTitle>Do you want to boost your business?</ImageCardTitle>

					<ImageCardDescription>
						Advertise here! Click this card to learn more about our advertising
						options.
					</ImageCardDescription>
				</ImageCardFooter>
			</ImageCard>
		);

	const { data: ad, success } = await getAdByAdSlot(slot);

	if (!ad || !success || !('id' in ad))
		return (
			<ImageCard
				linkHover
				className={cn(
					'dark:border border-muted fade-in mt-12 shadow-none',
					className
				)}
			>
				<ImageCardFooter className="flex flex-col space-y-2 relative w-full overflow-hidden">
					<div className="relative w-full gap-x-2 flex overflow-x-hidden">
						<ImageCardTagGroup tags={[{ name: 'ad' }]} />
					</div>
					<ImageCardLink
						href={`/advertise`}
						data-umami-event="Ad Card"
						data-umami-event-ad="internal"
					/>
					<ImageCardTitle>Do you want to boost your business?</ImageCardTitle>

					<ImageCardDescription>
						Advertise here! Click this card to learn more about our advertising
						options.
					</ImageCardDescription>
				</ImageCardFooter>
			</ImageCard>
		);

	return (
		<ImageCard
			linkHover
			className={cn('fade-in mt-12 shadow-none h-auto', className)}
		>
			<ImageCardImageContainer className="aspect-auto">
				<ImageCardBanner className="flex gap-2 bg-transparent" location="tr">
					<ImageCardTagGroup tags={[{ name: 'ad' }]} />
				</ImageCardBanner>
				<SupabaseImage
					dbImageUrl={ad.image_url}
					width={750}
					height={90}
					database="ad_images"
					className="min-h-24 max-h-48"
					priority={false}
				/>{' '}
				<ImageCardLink
					href={ad.redirect_url}
					data-umami-event="Ad Card"
					data-umami-event-ad={ad.redirect_url}
				/>
			</ImageCardImageContainer>
		</ImageCard>
	);
}
