// Import Types
// Import External Packages
import { redirect } from 'next/navigation';
import Link from 'next/link';
// Import Components
import { buttonVariants } from '@/ui/Button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/ui/Card';
import {
	SectionHeaderContainer,
	SectionOuterContainer,
	SectionTitle,
	SubSectionInnerContainer,
	SubSectionTitle,
} from '@/ui/Section';
import AccessDenied from '@/components/AccessDenied';
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import getListingStats from '@/actions/listings/getListingStats';
import serverAuth from '@/actions/auth/serverAuth';
import getSublistingStats from '@/actions/sublistings/getSublistingStats';
import { userHasPermission, Roles, Permissions } from '@/rbac';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
import { cn } from '@/utils';
// Import Assets & Icons
import { MapPin, Settings } from 'lucide-react';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export default async function Dashboard() {
	const { user, error } = await serverAuth({ checkUser: true });

	if (user && user.is_active === false) {
		const supabase = createSupabaseRLSClient();
		await supabase.auth.signOut();
		return redirect('/auth-error');
	}

	if (!user || error) {
		return redirect('/sign-up');
	}

	/* Example showing a custom component based on a permission to stop displaying other components afterwards.  */

	if (
		GENERAL_SETTINGS.USE_RBAC &&
		!userHasPermission(user.role as Roles, Permissions.MANAGE_LISTING)
	) {
		return (
			<SectionOuterContainer>
				<SectionTitle>Welcome!</SectionTitle>

				<SubSectionInnerContainer>
					<p className="text-xl text-muted-foreground mb-8">
						Thank you for joining our journey. You are now able to access
						exclusive features and benefits.
					</p>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>Account Settings</CardTitle>
								<CardDescription>
									Manage your profile and preferences
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Link
									href="/account/settings"
									className={cn(
										buttonVariants({ variant: 'default', size: 'sm' })
									)}
								>
									<Settings className="mr-2 h-4 w-4" />
									Edit Settings
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>See Listings</CardTitle>
								<CardDescription>Explore all listings</CardDescription>
							</CardHeader>
							<CardContent>
								<Link
									href="/explore"
									className={cn(
										buttonVariants({ variant: 'default', size: 'sm' })
									)}
								>
									<MapPin className="mr-2 h-4 w-4" />
									View Listings
								</Link>
							</CardContent>
						</Card>
					</div>

					<div className="mt-12">
						<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
						<ol className="list-decimal list-inside space-y-2">
							<li>Browse our directorys</li>
							<li>Visit a listing page to view all details</li>
							<li>Find exclusive coupon codes on the listing pages</li>
							<li>
								Use the coupons when visiting the companies or purchasing their
								products
							</li>
						</ol>
					</div>
				</SubSectionInnerContainer>
			</SectionOuterContainer>
		);
	}

	/* Example showing a custom Access Denied component when user role does not have enough permission. */
	if (
		GENERAL_SETTINGS.USE_RBAC &&
		(!user.role ||
			!userHasPermission(user.role as Roles, Permissions.ACCESS_DASHBOARD))
	) {
		return <AccessDenied />;
	}

	/* Example showing a dashboard with statistics for the user - who has the right role */

	const { data: stats } = await getListingStats(user.id);

	const sumOfAllListings = stats.total_listings;
	const sumOfAllLikes = stats.total_likes;
	const sumOfAllViews = stats.total_views;
	const sumOfAllClicks = stats.total_clicks;

	const { data: sublistingStats } = await getSublistingStats(user.id);

	const sumOfAllSublistings = sublistingStats.total_sublistings;
	const sumOfAllSublistingLikes = sublistingStats.total_likes;
	const sumOfAllSublistingViews = sublistingStats.total_views;
	const sumOfAllSublistingClicks = sublistingStats.total_clicks;

	return (
		<SectionOuterContainer>
			<SectionHeaderContainer>
				<SectionTitle className="text-left mx-0 max-w-none">
					Dashboard
				</SectionTitle>
			</SectionHeaderContainer>
			<SubSectionInnerContainer>
				<h2 className="text-lg text-foregroung py-4">Listings</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
					<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
						<p className="text-2xl text-muted-foreground">
							{formatter.format(sumOfAllListings).toLocaleString()}
						</p>
						<h3 className="text-lg font-bold tracking-tight">Total Listings</h3>
					</div>
					<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
						<p className="text-2xl text-muted-foreground">
							{formatter.format(sumOfAllViews).toLocaleString()}
						</p>
						<h3 className="text-lg font-bold tracking-tight">Total Views</h3>
					</div>
					<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
						<p className="text-2xl text-muted-foreground">
							{formatter.format(sumOfAllLikes).toLocaleString()}
						</p>
						<h3 className="text-lg font-bold tracking-tight">Total Likes</h3>
					</div>
					<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
						<p className="text-2xl text-muted-foreground">
							{formatter.format(sumOfAllClicks).toLocaleString()}
						</p>
						<h3 className="text-lg font-bold tracking-tight">Total Clicks</h3>
					</div>
				</div>

				{GENERAL_SETTINGS.USE_SUBLISTINGS && (
					<>
						<h2 className="text-lg text-foregroung py-4">Sublistings</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
							<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
								<p className="text-2xl text-muted-foreground">
									{formatter.format(sumOfAllSublistings).toLocaleString()}
								</p>
								<h3 className="text-lg font-bold tracking-tight">
									Total Listings
								</h3>
							</div>
							<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
								<p className="text-2xl text-muted-foreground">
									{formatter.format(sumOfAllSublistingViews).toLocaleString()}
								</p>
								<h3 className="text-lg font-bold tracking-tight">
									Total Views
								</h3>
							</div>
							<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
								<p className="text-2xl text-muted-foreground">
									{formatter.format(sumOfAllSublistingLikes).toLocaleString()}
								</p>
								<h3 className="text-lg font-bold tracking-tight">
									Total Likes
								</h3>
							</div>
							<div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
								<p className="text-2xl text-muted-foreground">
									{formatter.format(sumOfAllSublistingClicks).toLocaleString()}
								</p>
								<h3 className="text-lg font-bold tracking-tight">
									Total Clicks
								</h3>
							</div>
						</div>
					</>
				)}

				<div className="place-self-start mt-8">
					<SubSectionTitle className="text-left md:text-xl">
						Quick Links
					</SubSectionTitle>
					<ul className="grid grid-cols-2 gap-2">
						<li>
							<Link href="/account/listings" className="text-blue-500">
								Manage Your Listings
							</Link>
						</li>
						<li>
							<Link href="/account/new-listing" className="text-blue-500">
								Create New Listing
							</Link>
						</li>
						<li>
							<Link href="/account/posts" className="text-blue-500">
								Manage Your Blog Posts
							</Link>
						</li>
						<li>
							<Link href="/account/new-post" className="text-blue-500">
								Create New Blog Post
							</Link>
						</li>
						<li>
							<Link href="/account/settings" className="text-blue-500">
								Manage Account Settings
							</Link>
						</li>
					</ul>
				</div>
			</SubSectionInnerContainer>
		</SectionOuterContainer>
	);
}
