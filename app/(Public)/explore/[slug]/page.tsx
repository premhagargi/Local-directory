// Import Types
import { FullTagType, TagType } from '@/supabase-special-types';
import type { Metadata } from 'next';
// Import External Packages
import { MDXRemote as ArticleContent } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
// Import Components
import ListingActionBar from '../_components/ListingActionBar';
import ExternalLinkButton from '@/components/listings/ExternalLinkButton';
import CommentSystem from '@/components/comments/CommentSystem';
import { useMDXComponents } from '@/mdx-components';
import ListingCard from '@/components/listings/ListingCard';
import SupabaseImage from '@/components/SupabaseImage';
import ViewPixel from '@/components/tracking/ViewPixel';
import Breadcrumps from '@/ui/Breadcrumps';
import UserAvatar from '@/ui/UserAvatar';
import {
	SectionOuterContainer,
	SectionTitle,
	SubSectionTitle,
	SectionDescription,
	SubSectionInnerContainer,
} from '@/ui/Section';
import CopyCouponCode from '../../products/_components/CopyCouponCode';
import GoogleMapsBox from '@/components/GoogleMapsBox';
import NewsletterBox_BeeHiiv from '@/components/NewsletterSection';
// Import Functions & Actions & Hooks & State
import getCommentsByCategoryAndId from '@/actions/comments/getCommentsByCategoryAndId';
import getPublishedListingBySlug from '@/actions/listings/getPublishedListingBySlug';
import getPublishedListings from '@/actions/listings/getPublishedListings';
import createMetaData from '@/lib/createMetaData';
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { stringToSlug } from '@/utils';
import getFullTags from '@/actions/tags/getFullTags';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { BadgeCheckIcon } from 'lucide-react';

type Props = {
	params: { slug: string };
};

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params

export async function generateStaticParams() {
	const supabase = createSupabaseBrowserClient();
	let results;
	try {
		results = await supabase
			.from('listings')
			.select('slug')
			.match({ is_user_published: true, is_admin_published: true });
		if (results.error) {
			console.error(results.error.message);
			return [];
		}
		if (!results.data) {
			return [];
		} else {
			return results.data.map(({ slug }) => ({ slug: slug }));
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

// https://nextjs.org/docs/app/building-your-application/optimizing/metadata

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { data: listingData } = await getPublishedListingBySlug(params.slug);

	if (!('id' in listingData)) {
		return createMetaData({
			customTitle: 'Listing',
			customDescription: `This service is listed on ${COMPANY_BASIC_INFORMATION.NAME}. Find everything you need to know about this service and get in touch with the creator.`,
		});
	}

	const supabase = createSupabaseBrowserClient();
	let ogImageUrl = '';

	if (listingData.default_image_url) {
		const publicUrlLocation = supabase.storage
			.from('listing_images')
			.getPublicUrl(listingData.default_image_url);
		ogImageUrl = publicUrlLocation.data?.publicUrl ?? '';
	}

	return createMetaData({
		customTitle: listingData.title,
		customDescription:
			listingData.excerpt ??
			listingData.title ??
			`Listing on ${COMPANY_BASIC_INFORMATION.NAME}`,
		customTags: [
			listingData.category.name,
			...listingData.tags.map((tag) => tag.name),
		],
		customImages:
			ogImageUrl && ogImageUrl !== ''
				? [
						{
							url: ogImageUrl,
							alt: `Image of ${listingData.title} on ${COMPANY_BASIC_INFORMATION.NAME}`,
							type: 'image',
							width: 900,
							height: 600,
						},
				  ]
				: undefined,
		customSlug: `explore/${params.slug}`,
	});
}

function clusterTagsByGroups(
	selected: { id: string; name: string; slug: string }[],
	allTags: FullTagType[]
) {
	const tagChoiceGroups: {
		[groupName: string]: TagType[];
	} = { Other: [] };

	selected.forEach((selectedTag) => {
		const correspondingTag = allTags.find(
			(tag) => tag.slug === selectedTag.slug
		);

		if (!correspondingTag || !correspondingTag.tag_groups) return;

		if (correspondingTag.tag_groups.length === 0) {
			tagChoiceGroups['Other'].push(correspondingTag);
		} else {
			if (!tagChoiceGroups[correspondingTag.tag_groups[0].name]) {
				tagChoiceGroups[correspondingTag.tag_groups[0].name] = [];
			}

			tagChoiceGroups[correspondingTag.tag_groups[0].name].push(
				correspondingTag
			);
		}
	});

	if (tagChoiceGroups['Other'].length === 0) {
		delete tagChoiceGroups['Other'];
	}

	return tagChoiceGroups;
}

export default async function ListingPage({ params }: Props) {
	const { data: listing } = await getPublishedListingBySlug(params.slug);

	if (!('id' in listing)) return notFound();

	const { data: comments } = await getCommentsByCategoryAndId(
		'listing_id',
		listing.id
	);

	const { data: listingData } = await getPublishedListings(2, listing.id);

	const { data: tagData } = await getFullTags('active');

	const tagGroups = clusterTagsByGroups(listing.tags, tagData);

	return (
		<SectionOuterContainer>
			<div className="w-full bg-background-secondary py-10 px-2 lg:px-0">
				<div className="max-w-5xl mx-auto">
					<Breadcrumps />
					<div className="relative">
						<SupabaseImage
							dbImageUrl={listing.default_image_url}
							width={1350}
							height={900}
							database="listing_images"
							priority
							className="aspect-video rounded-xl"
							imageAlt={`${listing.title} cover image on ${COMPANY_BASIC_INFORMATION.NAME}`}
						/>

						{!!listing.logo_image_url && (
							<div className="rounded-full absolute top-5 w-20 h-20 left-5 md:top-10 md:w-40 md:h-40 md:left-10 bg-background-secondary border-2 border-dark-foreground object-contain p-2 md:p-4">
								<div className="w-full h-full flex items-center">
									<SupabaseImage
										dbImageUrl={listing.logo_image_url}
										width={900}
										height={900}
										database="listing_images"
										priority
										className="object-contain"
										imageAlt={`${listing.title} logo on ${COMPANY_BASIC_INFORMATION.NAME}`}
									/>
								</div>
							</div>
						)}
					</div>

					{GENERAL_SETTINGS.USE_VIEW && <ViewPixel listingId={listing.id} />}

					<div className="flex justify-between mt-4">
						<div className="flex gap-x-2">
							<SectionTitle>{listing.title}</SectionTitle>
							{listing.owner_id && (
								<BadgeCheckIcon className="w-6 h-6 mr-2 text-green-400" />
							)}
						</div>

						<ExternalLinkButton
							listing={listing}
							textVariant={1}
							className="bg-dark-foreground rounded-2xl"
						/>
					</div>

					<SectionDescription>{listing.excerpt}</SectionDescription>

					<ListingActionBar listing={listing} className="mt-4 mx-auto" />

					<CopyCouponCode listingData={listing} className="mt-4" />

					<hr className="border-accent-2 my-8" />

					<div className="grid grid-cols-1 md:grid-cols-5 md:gap-8 space-y-2 md:space-y-4">
						<div className="col-span-2">
							<div className="bg-white dark:bg-transparent text-dark-foreground dark:text-white rounded-xl  col-span-1 space-y-4 p-4">
								<h2 className="text-xl font-semibold">LISTING INFORMATION</h2>
								<div className="grid gap-y-4">
									{listing.owner && (
										<div className="flex justify-between">
											<div className="font-semibold text-base">
												Verified Owner
											</div>
											<div className="text-base">
												{/* @ts-ignore : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */}
												<Link
													href={`/user/${(listing.owner as any).username}`}
													prefetch={false}
												>
													{(listing.owner as any).username}
													<span className="sr-only">
														User Profile of {(listing.owner as any).username}
													</span>
												</Link>
											</div>
										</div>
									)}

									{listing.category.name && (
										<div className="flex justify-between">
											<div className="font-semibold text-base">Category</div>
											<div className="text-base">
												<Link
													href={`/explore?category=${stringToSlug(
														listing.category.name
													)}`}
													key={listing.category.name}
													className="hover:underline"
												>
													{listing.category.name}
												</Link>
											</div>
										</div>
									)}

									{Object.keys(tagGroups).map((tagGroupName) => (
										<div key={tagGroupName} className="flex justify-between">
											<div className="font-semibold text-base">
												{tagGroupName}
											</div>

											<div className="text-base">
												{tagGroups[tagGroupName].map((tag) => (
													<div key={tag.name} className="text-right">
														<Link
															href={`/explore?tags=${stringToSlug(tag.name!)}`}
															key={tag.name}
															className="hover:underline"
														>
															{tag.name}
														</Link>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<article className="prose dark:prose-invert text-justify max-w-none col-span-3">
							<ArticleContent
								source={listing.description}
								components={{
									...useMDXComponents,
								}}
							/>
						</article>
					</div>

					<ExternalLinkButton
						listing={listing}
						textVariant={2}
						className="w-full mx-auto mt-8"
					/>
					{/* 

					DISABLE COMMENT TO ACTIVATE GOOGLE MAPS


					<GoogleMapsBox
						locationQuery={`${listing.title},${listing.category.name}`}
						className="rounded-xl overflow-hidden mt-8"
					/>
					*/}
				</div>
			</div>

			<div className="max-w-5xl mx-auto w-full my-10 px-2">
				<Suspense>
					<CommentSystem
						comments={comments}
						blog_or_listing_id={listing.id}
						blog_or_listing="listing_id"
					/>
				</Suspense>
			</div>

			<NewsletterBox_BeeHiiv />

			{listingData?.length !== 0 && (
				<div className="max-w-5xl mx-auto my-10 px-2">
					<SubSectionTitle>You May Also Like</SubSectionTitle>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{listingData?.map((listing) => (
							<ListingCard key={listing.id} listing={listing} user={null} />
						))}
					</div>
				</div>
			)}
		</SectionOuterContainer>
	);
}
