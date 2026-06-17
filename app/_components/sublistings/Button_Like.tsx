'use client';

// Import Types
import { SublistingType } from '@/supabase-special-types';
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
import incrementStatCounters from '@/actions/sublistings/incrementStatCounters';
import { toast } from '@/lib/useToaster';
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
import { HeartIcon } from 'lucide-react';

export default function LikeButton({
	sublisting,
	user,
}: {
	sublisting: SublistingType;
	user: any;
}) {
	const [isLiked, setIsLiked] = useState(false);

	if (!sublisting) {
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
								incrementStatCounters(sublisting.id, 'likes').then(() => {
									toast({
										title: 'Liked!',
										description: 'Thanks for your feedback! We appreciate it!',
									});
								});
							}}
							disabled={isLiked || !user}
						>
							<HeartIcon size="20" fill={isLiked ? 'red' : 'white'} />
							<span className="sr-only">Like this sublisting.</span>
						</Button>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>{user ? 'Like it!' : 'Sign in to like!'}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
