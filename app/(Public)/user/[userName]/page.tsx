// Import Types
import { Metadata } from 'next';
import { JSX, SVGProps } from 'react';
// Import External Packages
import { notFound } from 'next/navigation';
import Link from 'next/link';
// Import Components
import { SectionOuterContainer, SubSectionInnerContainer } from '@/ui/Section';
import ListingGrid from '@/components/listings/ListingGrid';
import { Avatar, AvatarFallback } from '@/ui/Avatar';
import UserAvatar from '@/ui/UserAvatar';
// Import Functions & Actions & Hooks & State
import getPublishedListingsByOwnerId from '@/actions/listings/getPublishedListingsByOwnerId';
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import getProfiles from '@/actions/users/getProfiles';
import createMetaData from '@/lib/createMetaData';
// Import Data
// Import Assets & Icons

type UserPageProps = {
	params: { userName: string };
};

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params

export async function generateStaticParams(): Promise<UserPageProps[]> {
	const usersQueryReponse = await getProfiles();

	const slugs: UserPageProps[] = usersQueryReponse.data.map(
		(userProfileObject) => {
			return {
				params: {
					userName: userProfileObject.username,
				},
			};
		}
	);
	return slugs;
}

// https://nextjs.org/docs/app/building-your-application/optimizing/metadata

export async function generateMetadata({
	params,
}: UserPageProps): Promise<Metadata> {
	const supabase = createSupabaseBrowserClient();

	return createMetaData({
		customTitle: 'User Profile',
		customDescription: `Public userProfile of ${params.userName}`,
		customSlug: `user/${params.userName}`,
	});
}

export default async function UserPage({ params }: UserPageProps) {
	const supabase = createSupabaseBrowserClient();

	if (!params.userName) return notFound();

	const { data, error } = await supabase
		.from('users')
		.select(`id, username, website, avatar_url`)
		.eq('username', params.userName)
		.single();

	if (error || !data) return notFound();

	const { data: ownersListings } = await getPublishedListingsByOwnerId(data.id);

	return (
		<SectionOuterContainer className="max-w-5xl">
			<header className="flex flex-col sm:flex-row items-center justify-between mb-8">
				<div className="flex items-center space-x-4">
					<Avatar className="w-16 h-16 rounded-full">
						<UserAvatar url={data.avatar_url} size={64} />
						<AvatarFallback>
							{data.username?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="text-2xl font-bold">{data.username}</h1>
					</div>
				</div>
				{data.website && (
					<div className="flex items-center space-x-4 mt-4 sm:mt-0">
						<Link
							href={data.website}
							className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
							prefetch={false}
						>
							<GlobeIcon className="w-5 h-5" />
							<span className="sr-only">Personal Website</span>
						</Link>
					</div>
				)}
			</header>
			<SubSectionInnerContainer>
				<ListingGrid
					listings={ownersListings}
					maxCols={3}
					showPagination={false}
					initialItemsPerPage={6}
				/>
			</SubSectionInnerContainer>
		</SectionOuterContainer>
	);
}

function GlobeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
			<path d="M2 12h20" />
		</svg>
	);
}
