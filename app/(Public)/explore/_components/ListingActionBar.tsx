// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
import { Suspense } from 'react';
// Import Components
import SocialShareBar from '@/components/SocialShareBar';
import ReportDialog from '@/components/feedback/Dialog_Report';
import RatingDialog from '@/components/listings/Dialog_Rating';
import NumberIconBadge from '@/ui/NumberIconBadge';
import LikeButton from '@/components/listings/Button_Like';
import DateComponent from '@/ui/DateComponent';
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
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { cn } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import {
	BarChart2Icon,
	FileKey2Icon,
	GemIcon,
	Heart,
	InfoIcon,
} from 'lucide-react';

function InfoDialog({ listing }: { listing: ListingType }) {
	if (!listing) return null;
	return (
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="outline" className="rounded-full p-2">
								<InfoIcon size="20" />
								<span className="sr-only">
									See more statistics about this listing.
								</span>
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>See stats!</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Listing Details</DialogTitle>
					<DialogDescription className="flex ">
						<span className="pr-1">Created: </span>{' '}
						<DateComponent dateString={listing.created_at!} />
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-12 py-4 text-center">
					{GENERAL_SETTINGS.USE_VIEW && (
						<div className="grid">
							<p className="text-base font-light">Views</p>
							<div className="text-lg font-semibold">
								<NumberIconBadge
									value={listing.views ?? 0}
									Icon={BarChart2Icon}
								/>
							</div>
						</div>
					)}
					{GENERAL_SETTINGS.USE_LIKE && (
						<div className="grid">
							<p className="text-base font-light">Likes</p>
							<div className="text-lg font-semibold">
								<NumberIconBadge value={listing.likes ?? 0} Icon={Heart} />
							</div>
						</div>
					)}
					{GENERAL_SETTINGS.USE_RATE && (
						<div className="grid">
							<p className="text-base font-light">Rating</p>
							<p className="text-lg">
								<span className="font-semibold">
									{listing.average_rating
										? listing.average_rating.toFixed(2)
										: 0}
								</span>{' '}
								(by{' '}
								<span className="font-semibold">
									{listing.ratings_count ?? 0}
								</span>{' '}
								ratings)
							</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

function ClaimDialog({ listing }: { listing: ListingType }) {
	if (!listing) return null;
	return !listing.owner_id ? (
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="outline" className="rounded-full p-2">
								<FileKey2Icon size="20" />
								<span className="sr-only">Claim this listing.</span>
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Claim it!</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Claim This Listing</DialogTitle>
					<DialogDescription className="flex">
						<span>This is your service and you want to make edits?</span>
					</DialogDescription>
				</DialogHeader>

				<p>
					Please send an email to{' '}
					<span className="font-semibold">
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}
					</span>{' '}
					using your company email.
				</p>
			</DialogContent>
		</Dialog>
	) : null;
}

function PromoteDialog() {
	return (
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="outline" className="rounded-full p-2">
								<GemIcon size="20" />
								<span className="sr-only">Promote this listing.</span>
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Promote it!</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Promote This Listing</DialogTitle>
					<DialogDescription className="flex">
						<span>Are you the owner and want to promote this listing?</span>
					</DialogDescription>
				</DialogHeader>

				<p>
					Please send an email to{' '}
					<span className="font-semibold">
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}
					</span>{' '}
					and we will get back to you with the details.
				</p>
			</DialogContent>
		</Dialog>
	);
}

/**
 * Renders the ListingActionBar component.
 *
 * @param productMeta - The product metadata.
 * @param className - The optional CSS class name.
 * @returns The rendered ListingActionBar component.
 */
export default async function ListingActionBar({
	listing,
	className,
}: {
	listing: ListingType;
	className?: string;
}) {
	if (!listing) return null;
	return (
		<div
			className={cn(
				'flex flex-wrap max-w-56 sm:max-w-none mx-auto items-center justify-center md:justify-center gap-4 md:py-4 dark:text-white',
				className
			)}
		>
			{GENERAL_SETTINGS.USE_LIKE && <LikeButton listing={listing} />}
			{GENERAL_SETTINGS.USE_RATE && <RatingDialog listing={listing} />}
			{GENERAL_SETTINGS.USE_CLAIM && <ClaimDialog listing={listing} />}
			{GENERAL_SETTINGS.USE_REPORT && (
				<Suspense>
					<ReportDialog />
				</Suspense>
			)}
			{GENERAL_SETTINGS.USE_PROMOTE && <PromoteDialog />}
			{GENERAL_SETTINGS.USE_STATS && <InfoDialog listing={listing} />}
			{GENERAL_SETTINGS.USE_SOCIAL_SHARE && (
				<SocialShareBar
					title=""
					className="rounded-full p-2"
					size="sm"
					currentSiteLink={`${
						COMPANY_BASIC_INFORMATION.URL
					}/explore/${listing.slug!}`}
				/>
			)}
		</div>
	);
}
