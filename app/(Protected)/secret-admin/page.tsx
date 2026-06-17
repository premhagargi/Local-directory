// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { Fragment } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/Card';
import {
	SectionOuterContainer,
	SectionTitle,
	SubSectionInnerContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import getRevenueFromPromotions from '@/actions/promotions/getRevenueFromPromotions';
import getSublistingStats from '@/actions/sublistings/getSublistingStats';
import getListingStats from '@/actions/listings/getListingStats';
import getRevenueFromAds from '@/actions/ads/getRevenueFromAds';
import getUserStats from '@/actions/users/getUserStats';
import serverAuth from '@/actions/auth/serverAuth';
import countPosts from '@/actions/blog/countPosts';
import countAds from '@/actions/ads/countAds';
// Import Data
// Import Assets & Icons
import {
	AlertCircleIcon,
	DollarSignIcon,
	EyeIcon,
	FileKey2Icon,
	GemIcon,
	LucideIcon,
	MegaphoneIcon,
	MousePointerClickIcon,
	Package2Icon,
	SheetIcon,
	StarIcon,
	ThumbsUpIcon,
	UserCheckIcon,
	UserCogIcon,
} from 'lucide-react';
import { GENERAL_SETTINGS } from '@/app/_constants/constants';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export const metadata: Metadata = {
	title: `Admin Area: Dashboard`,
};

export default async function AccountPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const { data: stats } = await getListingStats();
	const sumOfAllListings = stats?.total_listings ? stats.total_listings : 0;
	const sumOfAllLikes = stats?.total_likes ? stats.total_likes : 0;
	const sumOfAllViews = stats?.total_views ? stats.total_views : 0;
	const sumOfAllClicks = stats?.total_clicks ? stats.total_clicks : 0;
	const sumOfAllRatings = stats?.total_ratings ? stats.total_ratings : 0;
	const sumOfAllPromotions = stats?.total_promotions
		? stats.total_promotions
		: 0;
	const sumOfAllClaims = stats?.total_claims ? stats.total_claims : 0;

	const sumOfListingsThatNeedAdminApproval = stats
		? stats.total_admin_approval_needed
			? stats.total_admin_approval_needed
			: 0
		: 0;

	const { data: sumOfAllBlogPosts } = await countPosts();
	const { data: sumOfAllActiveAds } = await countAds();
	const { data: sumOfUsersObject } = await getUserStats();

	const { data: sumOfAllAdRevenues } = await getRevenueFromAds();
	const { data: sumOfAllPromotionRevenues } = await getRevenueFromPromotions();

	const { data: sublistingStats } = await getSublistingStats();

	const sumOfAllSublistings = sublistingStats?.total_sublistings
		? sublistingStats?.total_sublistings
		: 0;
	const sumOfAllSublistingLikes = sublistingStats?.total_likes
		? sublistingStats?.total_likes
		: 0;
	const sumOfAllSublistingViews = sublistingStats?.total_views
		? sublistingStats?.total_views
		: 0;
	const sumOfAllSublistingClicks = sublistingStats?.total_clicks
		? sublistingStats?.total_clicks
		: 0;
	const sumOfAllSublistingRatings = sublistingStats?.total_ratings
		? sublistingStats?.total_ratings
		: 0;
	const sumOfSublistingsThatNeedAdminApproval = stats
		? sublistingStats.total_admin_approval_needed
			? sublistingStats.total_admin_approval_needed
			: 0
		: 0;

	let statsData: {
		[key: string]: { label: string; value: number; icon: LucideIcon }[];
	} = {
		Revenue: [
			{
				label: 'Lifetime Revenue',
				value: (sumOfAllAdRevenues + sumOfAllPromotionRevenues) / 100,
				icon: DollarSignIcon,
			},
			{ label: 'Active Ads', value: sumOfAllActiveAds, icon: MegaphoneIcon },
			{ label: 'Active Promotions', value: sumOfAllPromotions, icon: GemIcon },
		],
		Listings: [
			{ label: 'Listings', value: sumOfAllListings, icon: Package2Icon },
			{ label: 'Claimed', value: sumOfAllClaims, icon: FileKey2Icon },
			{
				label: 'Unapproved',
				value: sumOfListingsThatNeedAdminApproval,
				icon: AlertCircleIcon,
			},
		],

		Users: [
			{
				label: 'Admins',
				value: sumOfUsersObject.admin,
				icon: UserCogIcon,
			},
			{
				label: 'Users',
				value: sumOfUsersObject.nonAdmin,
				icon: UserCheckIcon,
			},
		],
		Blog: [{ label: 'Blog Posts', value: sumOfAllBlogPosts, icon: SheetIcon }],

		'User Activity': [
			{ label: 'Listing Views', value: sumOfAllViews, icon: EyeIcon },
			{
				label: 'Listing Clicks',
				value: sumOfAllClicks,
				icon: MousePointerClickIcon,
			},
			{ label: 'Listing Likes', value: sumOfAllLikes, icon: ThumbsUpIcon },
			{ label: 'Listing Ratings', value: sumOfAllRatings, icon: StarIcon },
		],
	};

	if (GENERAL_SETTINGS.USE_SUBLISTINGS) {
		statsData.Sublistings = [
			{ label: 'Sublistings', value: sumOfAllSublistings, icon: Package2Icon },
			{
				label: 'Unapproved',
				value: sumOfSublistingsThatNeedAdminApproval,
				icon: AlertCircleIcon,
			},
		];
		statsData['User Activity'].push(
			{
				label: 'Sublisting Views',
				value: sumOfAllSublistingViews,
				icon: EyeIcon,
			},

			{
				label: 'Sublisting Clicks',
				value: sumOfAllSublistingClicks,
				icon: MousePointerClickIcon,
			},
			{
				label: 'Sublisting Likes',
				value: sumOfAllSublistingLikes,
				icon: ThumbsUpIcon,
			},

			{
				label: 'Sublisting Ratings',
				value: sumOfAllSublistingRatings,
				icon: StarIcon,
			}
		);
	}

	return (
		<SectionOuterContainer className="max-w-5xl">
			<SectionTitle>Admin Dashboard</SectionTitle>
			<SubSectionInnerContainer className="col-span-4 space-y-4">
				{Object.keys(statsData).map((section) => (
					<Fragment key={section}>
						<h2 className="font-bold text-lg">{section}</h2>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mt-8">
							{statsData[section as keyof typeof statsData].map((stat) => (
								<Card key={stat.label}>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<CardTitle className="text-sm font-medium">
											{stat.label}
										</CardTitle>
										<stat.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{formatter.format(stat.value).toLocaleString()}
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</Fragment>
				))}
			</SubSectionInnerContainer>
		</SectionOuterContainer>
	);
}
