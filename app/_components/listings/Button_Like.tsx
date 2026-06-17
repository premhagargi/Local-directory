'use client';

// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import { Button } from '@/ui/Button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/ui/Tooltip';
// Import Functions & Actions & Hooks & State
import incrementStatCounters from '@/actions/listings/incrementStatCounters';
import { toast } from '@/lib/useToaster';
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
import { HeartIcon } from 'lucide-react';

export default function LikeButton({ listing }: { listing: ListingType }) {
	const [isLiked, setIsLiked] = useState(false);

	if (!listing) {
		return null;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="w-fit h-fit">
						<Button
							variant="outline"
							className={cn(
								'rounded-full p-2',
								isLiked && 'border border-red-500 text-white'
							)}
							onClick={async () => {
								setIsLiked(true);
								incrementStatCounters(listing.id, 'likes').then(() => {
									toast({
										title: 'You liked this listing!',
										description: 'Thanks for your feedback! We appreciate it!',
									});
								});
							}}
							disabled={isLiked}
						>
							<HeartIcon size="20" fill={isLiked ? 'red' : 'white'} />
							<span className="sr-only">Like this listing.</span>
						</Button>
					</div>
				</TooltipTrigger>
				<TooltipContent>Like it!</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
