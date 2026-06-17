'use client';
// Import Types
import { Tables } from '@/supabase-types';
// Import External Packages
import Link from 'next/link';
// Import Components
import { buttonVariants } from '@/ui/Button';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/ui/Select';
import Pagination from '@/ui/Pagination';
// Import Functions & Actions & Hooks & State
import { cn, formatPassedTime } from '@/lib/utils';
import usePaginationLoader from '@/lib/usePaginationLoader';
// Import Data
// Import Assets & Icons
import {
	DollarSignIcon,
	EyeIcon,
	FileQuestion,
	FilterIcon,
	GemIcon,
	LayoutTemplateIcon,
	MegaphoneIcon,
	MessageCircleHeartIcon,
	MessageCircleMoreIcon,
	MousePointerClickIcon,
	NewspaperIcon,
	SearchIcon,
	StarIcon,
	TagIcon,
	TagsIcon,
	ThumbsUpIcon,
	User2,
	UserCheckIcon,
} from 'lucide-react';

const ACTIVITY_TYPES = [
	{
		type: 'new_listing',
		verbalize: 'created a new listing:',
		icon: LayoutTemplateIcon,
		link: '/secret-admin/listing-manager',
		linkText: 'View Listing',
	},
	{
		type: 'update_listing',
		verbalize: 'updated a listing:',
		icon: LayoutTemplateIcon,
		link: '/secret-admin/listing-manager',
		linkText: 'View Listing',
	},
	{ type: 'new_search', verbalize: 'searched for:', icon: SearchIcon },
	{
		type: 'new_post',
		verbalize: 'created a new blog post:',
		icon: NewspaperIcon,
		link: '/secret-admin/blog-manager',
		linkText: 'View Post',
	},
	{
		type: 'update_post',
		verbalize: 'updated a blog post:',
		icon: NewspaperIcon,
		link: '/secret-admin/blog-manager',
		linkText: 'View Post',
	},
	{
		type: 'new_click',
		verbalize: 'clicked on external link:',
		icon: MousePointerClickIcon,
	},
	{
		type: 'new_comment',
		verbalize: 'commented on:',
		icon: MessageCircleMoreIcon,
		link: '/secret-admin/comment-manager',
		linkText: 'View Comment',
	},
	{
		type: 'new_tag',
		verbalize: 'created a new tag:',
		icon: TagIcon,
		link: '/secret-admin/tag-manager',
		linkText: 'View Tag',
	},
	{
		type: 'new_category',
		verbalize: 'created a new category:',
		icon: TagsIcon,
		link: '/secret-admin/category-manager',
		linkText: 'View Category',
	},
	{
		type: 'new_ad',
		verbalize: 'created a new ad:',
		icon: GemIcon,
		link: '/secret-admin/ad-manager',
		linkText: 'View Ad',
	},
	{
		type: 'new_view',
		verbalize: 'viewed:',
		icon: EyeIcon,
		link: '/secret-admin/listing-manager',
		linkText: 'View Listing',
	},
	{
		type: 'new_like',
		verbalize: 'liked:',
		icon: ThumbsUpIcon,
		link: '/secret-admin/listing-manager',
		linkText: 'View Listing',
	},
	{
		type: 'new_rate',
		verbalize: 'rated:',
		icon: StarIcon,
		link: '/secret-admin/listing-manager',
		linkText: 'View Listing',
	},
	{
		type: 'new_feedback',
		verbalize: 'feedbacked:',
		icon: MessageCircleHeartIcon,
		link: '/secret-admin/feedback-manager',
		linkText: 'View Listing',
	},
	{
		type: 'new_promotion',
		verbalize: 'promoted:',
		icon: DollarSignIcon,
		link: '/secret-admin/promotion-manager',
		linkText: 'View Promotion',
	},
	{
		type: 'start_promotion',
		verbalize: 'started promotion:',
		icon: MegaphoneIcon,
		link: '/secret-admin/promotion-manager',
		linkText: 'View Promotion',
	},
	{
		type: 'end_promotion',
		verbalize: 'ended promotions:',
		icon: MegaphoneIcon,
		link: '/secret-admin/promotion-manager',
		linkText: 'View Promotion',
	},
	{ type: 'new_ai_content', verbalize: 'used AI to create content for:' },
	{ type: 'new_signup', verbalize: 'created a new user:', icon: UserCheckIcon },
	{ type: 'new_login', verbalize: 'logged in:', icon: User2 },
];

/**
 * A table component that displays Activity.
 * @param Activity - The Activity to display.
 */
export default function ActivityTable({
	activities,
	totalSizeOfCurrentDataChunk,
}: {
	activities: Tables<'activities'>[];
	totalSizeOfCurrentDataChunk: number;
}) {
	const {
		currentPage,
		totalPages,
		itemsPerPage,
		paginateBack,
		paginateFront,
		paginateBackFF,
		paginateFrontFF,
		changeItemsPerPage,
		changeTypeFilter,
		typeFilter,
	} = usePaginationLoader({
		totalSizeOfDataSet: totalSizeOfCurrentDataChunk,
	});

	const extendedActivities = activities.map((activity) => ({
		...activity,
		icon:
			ACTIVITY_TYPES.find((act) => act.type === activity.type)?.icon ||
			FileQuestion,
	}));

	return (
		<div>
			<Select
				value={typeFilter.toString()}
				onValueChange={(value) => {
					changeTypeFilter(value);
				}}
			>
				<SelectTrigger className="w-48">
					<SelectValue placeholder="Filter by Activity Type" />
					<FilterIcon className="h-4 w-4 opacity-50" />
				</SelectTrigger>
				<SelectContent className="bg-white text-foreground dark:bg-black dark:text-white">
					<SelectGroup>
						<SelectItem
							value={'all'}
							className="hover:bg-neutral-100 cursor-pointer"
						>
							Any Type
						</SelectItem>
						{ACTIVITY_TYPES.map((activitiyObject) => (
							<SelectItem
								key={activitiyObject.type}
								value={activitiyObject.type}
								className="hover:bg-neutral-100 cursor-pointer"
							>
								{activitiyObject.type}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<div className="grid gap-4 py-4">
				{extendedActivities.map((activity) => (
					<div
						key={activity.id}
						className="grid md:flex items-center gap-4 p-4 rounded-lg bg-muted"
					>
						<div className="flex items-center gap-4">
							<div className="flex-shrink-0">{<activity.icon />}</div>
							<div className="flex-1 grid gap-1">
								<div className="flex flex-wrap md:flex-nowrap items-center gap-2 text-sm">
									<div className="font-medium">
										{activity.user_id ? 'Registered User' : 'Anonymous'}
									</div>
									<div className="text-sm text-muted-foreground">
										{ACTIVITY_TYPES.find((act) => act.type === activity.type)
											?.verbalize || '-'}
									</div>
									<div className="font-medium">{activity.value || '-'}</div>
								</div>
								<div className="text-xs text-muted-foreground">
									{formatPassedTime(
										activity.created_at
											? new Date(activity.created_at).toISOString()
											: null
									)}
								</div>
							</div>
						</div>
						<div className="flex-1" />
						<div className="w-fit justify-self-end">
							{ACTIVITY_TYPES.find((act) => act.type === activity.type)
								?.link && (
								<Link
									href={
										ACTIVITY_TYPES.find((act) => act.type === activity.type)
											?.link || '/secret-admin'
									}
									className={cn(
										buttonVariants({ variant: 'default', size: 'sm' }),
										'justify-self-end'
									)}
								>
									{ACTIVITY_TYPES.find((act) => act.type === activity.type)
										?.linkText || 'View'}
								</Link>
							)}
						</div>
					</div>
				))}
			</div>

			<Pagination
				itemsPerPage={itemsPerPage}
				totalItems={totalSizeOfCurrentDataChunk}
				paginateBack={paginateBack}
				paginateFront={paginateFront}
				paginateBackFF={paginateBackFF}
				paginateFrontFF={paginateFrontFF}
				currentPage={currentPage}
				totalPages={totalPages}
				setItemsPerPage={changeItemsPerPage}
				pageSizeOptions={[5, 10, 25, 50]}
				nameOfItems="items"
			/>
		</div>
	);
}
