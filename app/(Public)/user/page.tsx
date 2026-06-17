// Import Types
import { Metadata } from 'next/types';
// Import External Packages
import Link from 'next/link';
// Import Components
import Breaker from '@/components/__home/Breaker';
import {
	SectionDescription,
	SectionOuterContainer,
	SectionTitle,
	SubSectionOuterContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import createMetaData from '@/lib/createMetaData';
import getProfiles from '@/actions/users/getProfiles';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = createMetaData({
	customTitle: 'Users',
	customDescription: `Here are the public profiles of all the listing owners on the platform. Click on a card to view their profile.`,
	customSlug: `user`,
});

export default async function UsersOverview() {
	const usersQueryReponse = await getProfiles();
	return (
		<SectionOuterContainer>
			<SectionTitle>Users</SectionTitle>
			<SectionDescription>
				Here are the public profiles of all the listing owners on the platform.
				Click on a card to view their profile.
			</SectionDescription>

			<SubSectionOuterContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-8">
				{usersQueryReponse.data.map((userProfile) => (
					<Link
						key={userProfile.username}
						href={`/user/${userProfile.username}`}
						className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
						prefetch={false}
					>
						<div className="text-2xl font-semibold">{`@${userProfile.username}`}</div>
					</Link>
				))}
			</SubSectionOuterContainer>
			<Breaker
				className=""
				imageSrc="/img/directory.jpg"
				imageAlt="directory business image"
				subHeadline="Have Your Own Tool?"
				headline="Claim Your Listing Today"
				description="Whether you're just getting started or looking to grow your business, we have the tools and resources to help you succeed."
				buttonText="Claim your listing"
				buttonHref="/account"
			/>
		</SectionOuterContainer>
	);
}
