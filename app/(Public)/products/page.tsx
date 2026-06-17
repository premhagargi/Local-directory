// Import Types
import { Metadata } from 'next/types';
// Import External Packages
import { Suspense } from 'react';
// Import Components
import NewsletterBox_BeeHiiv from '@/components/NewsletterSection';
import { SortDirectionBox } from '@/components/SortDirectionBox';
import SublistingOverview from '@/components/sublistings/SublistingOverview';
import {
	TagSearchBox,
	TagSearchBoxMobile,
} from '@/components/subtags/TagSearchBox';
import AdSlot from '@/components/ads/AdSlot';
import {
	SectionOuterContainer,
	SectionTitle,
	SubSectionInnerContainer,
	SubSectionOuterContainer,
} from '@/ui/Section';
import {
	ImageCard,
	ImageCardDescription,
	ImageCardFooter,
	ImageCardImageContainer,
	ImageCardTitle,
} from '@/ui/ImageCard';
import Breadcrumps from '@/ui/Breadcrumps';
// Import Functions & Actions & Hooks & State
import getPartialCategories from '@/actions/categories/getPartialCategories';
import getPartialSubcategories from '@/actions/subcategories/getPartialSubcategories';
import getPublishedListingsAsKeyValuePair from '@/actions/listings/getPublishedListingsAsKeyValuePair';
import getPartialSubtags from '@/actions/subtags/getPartialSubtags';
import createMetaData from '@/lib/createMetaData';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';

// Import Assets & Icons

export const metadata: Metadata = createMetaData({
	customTitle: 'Products',
	customDescription: `See, filter and sort all listings on ${COMPANY_BASIC_INFORMATION.NAME}. Find the best creators in the world. Get inspired by their work and hire them for your next project`,
	customSlug: `products`,
});

function OverviewLoading(params: {
	limit?: number;
	categoryName?: string;
	maxCols: number;
}) {
	return (
		<div
			className={`grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8 lg:grid-cols-${params.maxCols.toString()} w-full`}
		>
			{Array.from({ length: params.limit || 3 }, (_, i) => (
				<ImageCard key={i} className="animate-pulse min-h-24">
					<ImageCardImageContainer>
						<div className="w-full h-full min-w-48 min-h-48 bg-gray-200" />
					</ImageCardImageContainer>
					<ImageCardFooter className="grid space-y-2">
						<ImageCardTitle className="text-gray-500">Loading</ImageCardTitle>
						<ImageCardDescription className="text-gray-500">
							...
						</ImageCardDescription>
					</ImageCardFooter>
				</ImageCard>
			))}
		</div>
	);
}

// Dynamic Page because of searchParams. Could be changed to static if we push the searchParams to the client by using useSearchParams in the next best client component. However, this would require a lot of changes in the codebase.
export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const subtagData = await getPartialSubtags('active');
	const categoryData = await getPartialCategories('active');
	const subcategoryData = await getPartialSubcategories('active');
	const keyValueListings = await getPublishedListingsAsKeyValuePair();

	return (
		<SectionOuterContainer className="bg-background-secondary">
			<SubSectionOuterContainer className="md:py-10">
				<SubSectionInnerContainer className="max-w-7xl">
					<Breadcrumps />
					<div className="flex flex-wrap sm:flex-nowrap gap-4 pt-4">
						<Suspense fallback={null}>
							<TagSearchBox
								tags={subtagData.data}
								categories={categoryData.data}
								subcategories={subcategoryData.data}
								listings={keyValueListings.data}
								className="hidden lg:block"
							/>
						</Suspense>
						<div className="flex-grow">
							<div className="flex flex-wrap sm:flex-nowrap justify-between">
								<SectionTitle className="mx-0 max-w-none text-left">
									All Products
								</SectionTitle>

								<div className="flex justify-between w-full sm:w-fit pt-4 sm:pt-0">
									<TagSearchBoxMobile
										tags={subtagData.data}
										categories={categoryData.data}
										subcategories={subcategoryData.data}
										listings={keyValueListings.data}
										className="lg:hidden"
									/>
									<Suspense fallback={null}>
										<SortDirectionBox />
									</Suspense>
								</div>
							</div>
							<Suspense fallback={<OverviewLoading limit={6} maxCols={3} />}>
								<SublistingOverview
									categoryNavigation={false}
									filterAndSortParams={searchParams}
									maxNumSublistings={1000}
									maxCols={3}
									preferPromoted
									itemsPerPage={12}
									showSearch={false}
									className="py-0 md:py-0"
								/>
							</Suspense>
						</div>
					</div>

					<AdSlot slot={`products-2`} />
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>
			<NewsletterBox_BeeHiiv className="bg-white dark:bg-background-secondary" />
		</SectionOuterContainer>
	);
}
