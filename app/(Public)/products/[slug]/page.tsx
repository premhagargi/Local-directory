// Import Types
import type { Metadata } from 'next';
// Import External Packages
import { MDXRemote as ArticleContent } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Import Components
import SublistingCard from '@/components/sublistings/SublistingCard';
import CommentSystem from '@/components/comments/CommentSystem';
import ExternalLinkButton from '@/components/sublistings/ExternalLinkButton';
import { useMDXComponents } from '@/mdx-components';
import SupabaseImage from '@/components/SupabaseImage';
import ViewPixelSublisting from '@/components/tracking/ViewPixelSublisting';
import Breadcrumps from '@/ui/Breadcrumps';
import { Badge } from '@/ui/Badge';
import {
	SectionOuterContainer,
	SectionTitle,
	SectionDescription,
	SubSectionOuterContainer,
	SubSectionInnerContainer,
	SubSectionTitle,
} from '@/ui/Section';
import GoogleMapsBox from '@/components/GoogleMapsBox';
import NewsletterBox_BeeHiiv from '@/components/NewsletterSection';
import getPublishedSublistingBySlug from '@/actions/sublistings/getPublishedSublistingBySlug';
import CopyCouponCode from '../_components/CopyCouponCode';
// Import Functions & Actions & Hooks & State
import getPublishedSublistings from '@/actions/sublistings/getPublishedSublistings';
import PriceDisplay from '@/components/sublistings/PriceDisplay';
import SublistingActionBar from '../_components/SublistingActionBar';
import getPublishedListingById from '@/actions/listings/getPublishedListingById';
import createMetaData from '@/lib/createMetaData';
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { cn, stringToSlug } from '@/utils';
import getCommentsByCategoryAndId from '@/actions/comments/getCommentsByCategoryAndId';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { MapPinIcon } from 'lucide-react';

type Props = {
	params: { slug: string };
};

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params

export async function generateStaticParams() {
	const supabase = createSupabaseBrowserClient();
	let results;
	try {
		results = await supabase
			.from('sublistings')
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
	const { data: listingData } = await getPublishedSublistingBySlug(params.slug);

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
			.from('sublisting_images')
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
			listingData.subcategory.name,
			...listingData.subtags.map((tag) => tag.name),
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
		customSlug: `products/${params.slug}`,
	});
}

export default async function SublistingPage({ params }: Props) {
	const { data: sublisting } = await getPublishedSublistingBySlug(params.slug);

	if (!('id' in sublisting)) return notFound();

	const { data: listingData } = await getPublishedListingById(
		sublisting.listing_id!
	);

	const { data: otherSublistingData } = await getPublishedSublistings(
		2,
		sublisting.id
	);

	const { data: comments } = await getCommentsByCategoryAndId(
		'sublisting_id',
		sublisting.id
	);

	if (!('id' in listingData)) return notFound();

	return (
		<SectionOuterContainer className="bg-background-secondary">
			<SubSectionOuterContainer>
				<SubSectionInnerContainer className="max-w-7xl">
					<Breadcrumps />

					<div className="max-w-7xl grid grid-cols-1 md:grid-cols-5 mx-auto md:gap-x-4">
						<div className="col-span-3">
							<hr className="border-accent-2 my-2 md:hidden" />
							<h3 className="text-lg font-semibold text-foreground md:hidden py-1">
								ABOUT THIS PRODUCT
							</h3>
							<SupabaseImage
								dbImageUrl={sublisting.default_image_url}
								width={800}
								height={450}
								database="sublisting_images"
								priority
								className="w-full min-h-0 max-h-96 aspect-square rounded-lg hidden md:block"
							/>

							{GENERAL_SETTINGS.USE_VIEW && (
								<ViewPixelSublisting sublistingId={sublisting.id} />
							)}

							<div className="flex gap-1 w-fit my-2 flex-wrap">
								{sublisting &&
									sublisting?.subtags?.map((tag) => (
										<Link
											href={`/explore?tags=${stringToSlug(tag.name!)}`}
											key={tag.name}
										>
											<Badge
												variant="outline"
												className="z-50   hover:border-slate-500 whitespace-nowrap bg-neutral-200 dark:bg-background-secondary"
											>
												{tag.name}
											</Badge>
										</Link>
									))}
							</div>

							<SectionDescription>{sublisting.excerpt}</SectionDescription>

							<hr className="border-accent-2 my-8" />

							<article className="prose dark:prose-invert xl:prose-xl text-justify max-w-none">
								<ArticleContent
									source={sublisting.description}
									components={{
										...useMDXComponents,
									}}
								/>
							</article>
						</div>
						<div className="col-span-2 order-first md:order-last md:px-4 space-y-2">
							<SupabaseImage
								dbImageUrl={sublisting.default_image_url}
								width={800}
								height={450}
								database="sublisting_images"
								priority
								className="w-full min-h-0 max-h-96 aspect-square rounded-lg md:hidden mb-2"
							/>
							<Link
								href={`/products?subcategory=${stringToSlug(
									sublisting.subcategory?.slug || ''
								)}`}
								key={sublisting.subcategory_id}
								className="uppercase text-muted-foreground"
							>
								{sublisting.subcategory.name}
							</Link>

							<SectionTitle>{sublisting.title}</SectionTitle>

							<SublistingActionBar
								sublisting={sublisting}
								className="mt-4 mx-auto"
							/>

							<PriceDisplay sublisting={sublisting} increaseFontSize />

							<div className="flex flex-wrap gap-1">
								{listingData &&
									listingData?.tags?.map((tag) => (
										<Link
											href={`/explore?tags=${stringToSlug(tag.name!)}`}
											key={tag.name}
										>
											<Badge
												variant="outline"
												className="z-50  hover:border-slate-500 whitespace-nowrap bg-neutral-200 dark:bg-background-secondary"
											>
												{tag.name}
											</Badge>
										</Link>
									))}
							</div>
							<div className="flex flex-nowrap py-2 gap-2 w-full">
								<ExternalLinkButton
									sublisting={sublisting}
									className=" bg-dark-foreground rounded-full text-lg w-6/12"
									type="listing"
								/>
								<ExternalLinkButton
									sublisting={sublisting}
									className="bg-transparent hover:bg-white dark:hover:text-black rounded-full text-lg w-6/12"
									type="product"
								/>
							</div>

							<CopyCouponCode listingData={listingData} />

							{listingData && (
								<div className="grid gap-y-2">
									{/* 

									Uncomment for Google Maps - need to add address to listing data


									<hr className="border-accent-2 mt-2" />

									<h3 className="text-lg font-semibold text-foreground  py-2">
										SOURCE
									</h3>
									{listingData.address && (
										<p className="text-sm flex items-center">
											<MapPinIcon size={16} />
											{listingData.address}
										</p>
									)}
									<GoogleMapsBox
										locationQuery={`${listingData.title},${listingData.category.name},USA`}
									/>
									*/}
									<hr className="border-accent-2 mt-2" />
									<h3 className="text-lg font-semibold text-foreground  py-2">
										ABOUT VENDOR
									</h3>
									<div className="flex justify-between">
										{listingData.logo_image_url && (
											<div className="w-fit flex-shrink">
												<SupabaseImage
													dbImageUrl={listingData.logo_image_url}
													width={100}
													height={50}
													database="listing_images"
													priority
													className="h-auto w-24  max-h-14"
												/>
											</div>
										)}
									</div>

									<p className="text-base text-muted-foreground mt-2">
										{listingData.excerpt}
									</p>
								</div>
							)}
						</div>
					</div>
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>

			<div className="bg-white bg-background-secondary py-5">
				<div className="max-w-5xl mx-auto">
					<Suspense>
						<CommentSystem
							comments={comments}
							blog_or_listing_id={sublisting.id}
							blog_or_listing="sublisting_id"
						/>
					</Suspense>
				</div>
			</div>

			<NewsletterBox_BeeHiiv />

			{otherSublistingData?.length !== 0 && (
				<div className="w-full  bg-white dark:bg-background-secondary">
					<div className="max-w-5xl mx-auto my-10 px-2">
						<SubSectionTitle>You May Also Like</SubSectionTitle>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{otherSublistingData?.map((sublisting) => (
								<SublistingCard key={sublisting.id} sublisting={sublisting} />
							))}
						</div>
					</div>
				</div>
			)}
		</SectionOuterContainer>
	);
}
