// Import Types
import type { Metadata } from 'next';
// Import External Packages
import { MDXRemote as ArticleContent } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Import Components
import SublistingCard from '@/components/sublistings/SublistingCard';
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

	if (!('id' in listingData)) return notFound();

	return (
		<SectionOuterContainer className="bg-background-secondary">
			<SubSectionOuterContainer>
				<SubSectionInnerContainer className="max-w-7xl items-center">
					<div className="w-full self-start">
						<Breadcrumps />
					</div>

					{/* Centered Top Content (Logo, Title, Tags, Action Buttons) */}
					<div className="w-full max-w-4xl self-center mx-auto mt-6 mb-8 px-4 flex flex-col items-center text-center">
						{listingData?.logo_image_url && (
							<SupabaseImage
								dbImageUrl={listingData.logo_image_url}
								width={100}
								height={100}
								database="listing_images"
								priority
								className="h-20 w-20 rounded-[14px] object-cover shadow-sm mb-4"
							/>
						)}

						<Link
							href={`/products?subcategory=${stringToSlug(
								sublisting.subcategory?.slug || ''
							)}`}
							key={sublisting.subcategory_id}
							className="uppercase text-muted-foreground text-sm font-semibold tracking-wider mb-2"
						>
							{sublisting.subcategory.name}
						</Link>

						<SectionTitle className="mb-2">{sublisting.title}</SectionTitle>

						{listingData?.tagline && (
							<p className="text-xl md:text-2xl font-heading text-muted-foreground mt-2 mb-4 leading-relaxed max-w-2xl">
								{listingData.tagline}
							</p>
						)}

						<div className="flex flex-wrap gap-2 justify-center mb-6">
							{sublisting?.subtags?.map((tag) => (
								<Link
									href={`/explore?tags=${stringToSlug(tag.name!)}`}
									key={tag.name}
								>
									<Badge
										variant="outline"
										className="z-50 hover:border-slate-500 whitespace-nowrap bg-neutral-200 dark:bg-background-secondary"
									>
										{tag.name}
									</Badge>
								</Link>
							))}
							{listingData?.tags?.map((tag) => (
								<Link
									href={`/explore?tags=${stringToSlug(tag.name!)}`}
									key={tag.name}
								>
									<Badge
										variant="outline"
										className="z-50 hover:border-slate-500 whitespace-nowrap bg-neutral-200 dark:bg-background-secondary"
									>
										{tag.name}
									</Badge>
								</Link>
							))}
						</div>

						<div className="flex flex-wrap justify-center gap-3 w-full max-w-md mx-auto mb-6">
							<ExternalLinkButton
								sublisting={sublisting}
								className="bg-dark-foreground text-white hover:opacity-90 rounded-full text-base flex-1 min-w-[140px]"
								type="listing"
							/>
							<ExternalLinkButton
								sublisting={sublisting}
								className="bg-transparent border border-border hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground rounded-full text-base flex-1 min-w-[140px]"
								type="product"
							/>
						</div>

						<CopyCouponCode listingData={listingData} />

						{GENERAL_SETTINGS.USE_VIEW && (
							<ViewPixelSublisting sublistingId={sublisting.id} />
						)}
					</div>

					{/* Centered Screenshot */}
					{sublisting.default_image_url && (
						<div className="w-full max-w-4xl self-center mx-auto mb-10 px-4">
							<SupabaseImage
								dbImageUrl={sublisting.default_image_url}
								width={1200}
								height={630}
								database="sublisting_images"
								priority
								className="w-full rounded-[14px] aspect-[1.91/1] object-cover shadow-sm bg-neutral-100 dark:bg-neutral-800"
							/>
						</div>
					)}

					{/* Centered Description Content */}
					<div className="w-full max-w-3xl self-center mx-auto px-4 mb-10">
						<SublistingActionBar
							sublisting={sublisting}
							className="mb-8 justify-center border-y border-border/40 py-4 gap-4 flex-wrap"
						/>

						<h3 className="text-2xl font-bold text-foreground mb-4">
							Get to know {sublisting.title}
						</h3>

						<SectionDescription className="text-lg leading-relaxed mb-6">
							{sublisting.excerpt}
						</SectionDescription>

						{listingData?.excerpt && (
							<p className="text-base text-muted-foreground mt-2 mb-8">
								{listingData.excerpt}
							</p>
						)}

						<article className="prose dark:prose-invert xl:prose-xl text-justify max-w-none mx-auto">
							<ArticleContent
								source={sublisting.description}
								components={{
									...useMDXComponents,
								}}
							/>
						</article>
					</div>
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>

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
