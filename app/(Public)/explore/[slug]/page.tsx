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
import ListingGallery from '@/components/listings/ListingGallery';
import CommentSystem from '@/components/comments/CommentSystem';
import { useMDXComponents } from '@/mdx-components';
import ListingCard from '@/components/listings/ListingCard';
import SupabaseImage from '@/components/SupabaseImage';
import ViewPixel from '@/components/tracking/ViewPixel';
import UserAvatar from '@/ui/UserAvatar';
import CopyCouponCode from '../../products/_components/CopyCouponCode';
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
		<div className="w-full bg-background min-h-screen">
			{/* Hero image gallery — AppStacks horizontal scroll */}
			<ListingGallery
				images={[
					listing.default_image_url,
					...(listing.screenshot_urls || []),
				].filter((url): url is string => !!url)}
				alt={`${listing.title} on ${COMPANY_BASIC_INFORMATION.NAME}`}
			/>

			{/* Main content — AppStacks editorial centered layout */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6 pb-16">

				{GENERAL_SETTINGS.USE_VIEW && <ViewPixel listingId={listing.id} />}

				{/* App header: logo + title + CTA button */}
				<div className="flex items-center justify-between gap-4 mt-2 mb-6">
					<div className="flex items-center gap-3">
						{listing.logo_image_url && (
							<div className="w-11 h-11 rounded-[12px] overflow-hidden border border-border/50 bg-white flex-shrink-0 shadow-sm">
								<SupabaseImage
									dbImageUrl={listing.logo_image_url}
									width={80}
									height={80}
									database="listing_images"
									priority
									className="w-full h-full object-contain"
									imageAlt={`${listing.title} logo`}
								/>
							</div>
						)}
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-[28px] font-bold text-foreground leading-tight tracking-tight">
									{listing.title}
								</h1>
								{listing.owner_id && (
									<BadgeCheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
								)}
							</div>
							{listing.category?.name && (
								<Link
									href={`/explore?category=${stringToSlug(listing.category.name)}`}
									className="text-[13px] text-text-secondary hover:text-foreground transition-colors"
								>
									{listing.category.name}
								</Link>
							)}
						</div>
					</div>
					<ExternalLinkButton
						listing={listing}
						textVariant={1}
						className="flex-shrink-0 rounded-full border border-border bg-white hover:bg-neutral-50 text-foreground text-[13px] font-medium shadow-sm"
					/>
				</div>

				{/* Excerpt / description short */}
				{listing.excerpt && (
					<p className="text-[15px] text-foreground leading-relaxed mb-5">
						{listing.excerpt}
					</p>
				)}

				{/* Tech stack / tag pills — AppStacks style */}
				{Object.keys(tagGroups).length > 0 && (
					<div className="flex flex-wrap gap-2 mb-6">
						{Object.entries(tagGroups).flatMap(([, tags]) =>
							tags.map((tag) => (
								<Link
									key={tag.slug}
									href={`/explore?tags=${stringToSlug(tag.name!)}`}
									className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-white text-[13px] text-foreground hover:border-foreground/40 transition-colors shadow-sm"
								>
									{tag.name}
								</Link>
							))
						)}
					</div>
				)}

				{/* Action bar (like, share, etc.) */}
				<ListingActionBar listing={listing} className="mb-6" />

				{/* Coupon code if any */}
				<CopyCouponCode listingData={listing} className="mb-6" />

				<hr className="border-border/40 my-8" />

				{/* Editorial "Get to know X" description — AppStacks style */}
				{listing.description && (
					<div>
						<h2 className="text-[20px] font-bold text-foreground mb-6">
							Get to know {listing.title}
						</h2>
						<article className="prose prose-neutral dark:prose-invert max-w-none leading-[1.8] text-[15px]">
							<ArticleContent
								source={listing.description}
								components={{
									...useMDXComponents,
								}}
							/>
						</article>
					</div>
				)}

				{/* Listing info card */}
				{listing.owner && (
					<div className="mt-10 p-5 bg-white dark:bg-card rounded-[16px] border border-border/50">
						<h3 className="text-[11px] font-bold uppercase tracking-widest text-text-secondary mb-4">
							Listing Info
						</h3>
						<div className="space-y-3">
							<div className="flex justify-between items-center text-[14px]">
								<span className="text-text-secondary font-medium">Verified Owner</span>
								{/* @ts-ignore : Supabase Error */}
								<Link
									href={`/user/${(listing.owner as any).username}`}
									prefetch={false}
									className="text-foreground hover:underline font-medium"
								>
									{(listing.owner as any).username}
									<span className="sr-only">
										User Profile of {(listing.owner as any).username}
									</span>
								</Link>
							</div>
							{listing.category.name && (
								<div className="flex justify-between items-center text-[14px]">
									<span className="text-text-secondary font-medium">Category</span>
									<Link
										href={`/explore?category=${stringToSlug(listing.category.name)}`}
										className="text-foreground hover:underline font-medium"
									>
										{listing.category.name}
									</Link>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Bottom CTA */}
				<div className="mt-8">
					<ExternalLinkButton
						listing={listing}
						textVariant={2}
						className="w-full rounded-full"
					/>
				</div>
			</div>

			{/* Comments */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6 pb-12">
				<Suspense>
					<CommentSystem
						comments={comments}
						blog_or_listing_id={listing.id}
						blog_or_listing="listing_id"
					/>
				</Suspense>
			</div>

			{/* Newsletter */}
			<NewsletterBox_BeeHiiv />

			{/* Related listings */}
			{listingData?.length !== 0 && (
				<div className="max-w-[760px] mx-auto px-4 sm:px-6 pb-16">
					<h2 className="text-[20px] font-bold text-foreground mb-6">
						You May Also Like
					</h2>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						{listingData?.map((item) => (
							<ListingCard key={item.id} listing={item} user={null} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
