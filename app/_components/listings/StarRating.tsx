'use client';

// Import Types
// Import External Packages
import { useId } from 'react';
import { useState } from 'react';
// Import Components
// Import Functions & Actions & Hooks & State
import incrementStarRating from '@/actions/listings/incrementStarRating';
import { toast } from '@/lib/useToaster';
// Import Data
// Import Assets & Icons

/**
 * A star component that displays a star with a fill level.
 * @param filled - The current fill level (max 1).
 */

function Star({ filled }: { filled: number }) {
	const gradientId = useId();

	return (
		<svg
			className="stroke-black dark:stroke-white"
			width="25"
			height="25"
			viewBox="0 0 51 48"
		>
			<defs>
				<linearGradient id={gradientId} x2="100%" y2="0%">
					<stop
						offset={`${filled * 100}%`}
						style={{
							stopColor: 'var(--star-gradient-color)',
							stopOpacity: '1',
						}}
					/>
					<stop
						offset={`${filled * 100}%`}
						style={{
							stopColor: 'var(--star-gradient-color)',
							stopOpacity: '0',
						}}
					/>
				</linearGradient>
			</defs>
			<path
				fill={`url(#${gradientId})`}
				d="m25,0 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
			/>
		</svg>
	);
}

/**
 * Props for the StarRating component.
 */
interface StarRatingProps {
	rating: number;
	maxRating: number;
	numberOfStars: number;
	color?: string;
}

/**
 * A star rating component that displays a rating based on the number of stars.
 * @param rating - The current rating.
 * @param maxRating - The maximum rating value.
 * @param numberOfStars - The total number of stars to display.
 * @param color - The color of the stars.
 */
function StarRating({ rating, maxRating, numberOfStars }: StarRatingProps) {
	const fillLevel = (rating / maxRating) * numberOfStars;
	const fullStars = Math.floor(fillLevel);
	const partialFill = fillLevel - fullStars;

	return (
		<div className="flex">
			{Array.from({ length: numberOfStars }, (_, index) => {
				if (index < fullStars) {
					return <Star key={index} filled={1} />;
				} else if (index === fullStars) {
					return <Star key={index} filled={partialFill} />;
				}
				return <Star key={index} filled={0} />;
			})}
		</div>
	);
}

/**
 * Props for the HoverRating component.
 */
interface HoverRatingProps {
	numberOfStars: number;
	listingId: string;
	rating: number;
	ratingUpdate: (rating: number) => void;
}

/**
 * A star rating component that allows hovering to select a rating.
 * @param numberOfStars - The total number of stars to display.
 * @param listingId - The ID of the listing.
 * @param rating - The current rating.
 * @param ratingUpdate - A callback function to update the rating.
 */
function HoverRating({
	numberOfStars,
	listingId,
	rating,
	ratingUpdate,
}: HoverRatingProps) {
	const [hoverIndex, setHoverIndex] = useState(rating - 1);

	return (
		<div className="flex">
			<span className="w-10">{hoverIndex + 1}</span>

			{Array.from({ length: numberOfStars }, (_, index) => (
				<div
					key={index}
					onMouseEnter={() => setHoverIndex(index)}
					onMouseLeave={() => setHoverIndex(-1)}
					onClick={() => {
						rating === 0 && incrementStarRating(index + 1, listingId);
						ratingUpdate(index + 1);
						toast({
							title: 'Thanks for your feedback!',
							description: `You rated this listing ${index + 1} stars.`,
						});
					}}
					className="cursor-pointer"
				>
					<Star filled={index <= hoverIndex ? 1 : 0} />
				</div>
			))}
		</div>
	);
}

/**
 * Props for the StarRatingGroup component.
 */
interface StarRatingGroupProps {
	ratings: { desc: string; val: number }[];
	settings: {
		maxRating: number;
		numberOfStars: number;
		normalizedRating?: boolean;
		numberOfDigits?: number;
	};
}

/**
 * A group of star rating components with associated descriptions.
 * @param ratings - An array of rating objects containing a description and value.
 * @param settings - Additional settings for the star ratings.
 */
function StarRatingGroup({
	ratings,
	settings = {
		maxRating: 100,
		numberOfStars: 5,
		normalizedRating: false,
		numberOfDigits: 2,
	},
}: StarRatingGroupProps) {
	return (
		<table className="table-auto items-center gap-x-2 flex flex-shrink">
			<tbody>
				{ratings.map((rating, index) => (
					<tr key={index}>
						<td className="text-sm text-muted-foreground">{rating.desc}</td>
						<td>
							<span className="px-2 font-semibold">
								{(
									Math.round(
										rating.val *
											100 *
											(settings.normalizedRating
												? settings.numberOfStars / settings.maxRating
												: 1)
									) / 100
								).toFixed(settings.numberOfDigits ?? 2)}
							</span>
						</td>
						<td className="inline-flex items-center">
							<StarRating
								rating={rating.val}
								maxRating={settings.maxRating}
								numberOfStars={settings.numberOfStars}
							/>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export { StarRating, StarRatingGroup, HoverRating };
