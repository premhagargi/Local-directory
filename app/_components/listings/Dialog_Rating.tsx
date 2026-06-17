'use client';
// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import { HoverRating, StarRating } from '@/components/listings/StarRating';
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
// Import Assets & Icons
import { StarIcon } from 'lucide-react';

export default function RatingDialog({ listing }: { listing: ListingType }) {
	const [rating, setRating] = useState(0);

	if (!listing) {
		return null;
	}
	return (
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<div className="w-fit h-fit">
								<Button variant="outline" className="rounded-full p-2">
									<StarIcon size="20" />
									<span className="sr-only">Rate this listing.</span>
								</Button>
							</div>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>Rate it!</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rate this listing!</DialogTitle>
					<DialogDescription className="flex">
						<span className="pr-1">
							Express yourself through a star rating!
						</span>
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-y-4 my-4">
					<p>
						Current Rating <br /> ({listing.ratings_count ?? 0} ratings)
					</p>
					<div className="flex">
						<span className="w-10">
							{listing.average_rating?.toFixed(2) ?? 0}
						</span>
						<StarRating
							rating={listing.average_rating ?? 0}
							maxRating={5}
							numberOfStars={5}
						/>{' '}
					</div>
					<p>Your Rating</p>
					<div className="flex items-center">
						{rating === 0 ? (
							<HoverRating
								numberOfStars={5}
								listingId={listing.id}
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
