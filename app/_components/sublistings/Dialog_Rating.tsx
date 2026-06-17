'use client';
// Import Types
import { SublistingType } from '@/supabase-special-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import { HoverRating, StarRating } from '@/components/sublistings/StarRating';
import { Button } from '@/ui/Button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/ui/Tooltip';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
} from '@/ui/Dialog';
// Import Functions & Actions & Hooks & State
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

export default function RatingDialog({
	sublisting,
}: {
	sublisting: SublistingType;
}) {
	const [rating, setRating] = useState(0);

	if (!sublisting) {
		return null;
	}
	return (
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="ghost" className="p-0">
								{GENERAL_SETTINGS.USE_RATING_ON_CARD && (
									<div className=" rounded-sm w-fit px-1 text-sm tracking-tight whitespace-nowrap flex gap-x-2">
										{sublisting.average_rating} / 5
										<StarRating
											rating={sublisting.average_rating}
											maxRating={5}
											numberOfStars={5}
											addRating={false}
										/>
									</div>
								)}
								<span className="sr-only">Rate this sublisting.</span>
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>Rate it</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rate this sublisting!</DialogTitle>
					<DialogDescription className="flex">
						<span className="pr-1">
							Express yourself through a star rating!
						</span>
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-y-4 my-4">
					<p>
						Current Rating <br /> ({sublisting.ratings_count ?? 0} ratings)
					</p>
					<div className="flex">
						<span className="w-10">
							{sublisting.average_rating?.toFixed(2) ?? 0}
						</span>
						<StarRating
							rating={sublisting.average_rating ?? 0}
							maxRating={5}
							numberOfStars={5}
						/>{' '}
					</div>
					<p>Your Rating</p>
					<div className="flex items-center">
						{rating === 0 ? (
							<HoverRating
								numberOfStars={5}
								sublistingId={sublisting.id}
								rating={rating}
								ratingUpdate={setRating}
							/>
						) : (
							<>
								<span className="w-10">{rating ?? 0}</span>
								<StarRating rating={rating} maxRating={5} numberOfStars={5} />
							</>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
