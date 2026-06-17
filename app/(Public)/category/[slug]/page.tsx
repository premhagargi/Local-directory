// Import Types
import { Metadata } from 'next/types';
// Import External Packages
import { notFound } from 'next/navigation';
// Import Components
import ListingOverview from '@/components/listings/ListingOverview';
import CategoryBar from '@/components/categories/CategoryBar';
import AdSlot from '@/components/ads/AdSlot';
import CategoryHero from '@/components/categories/CategoryHero';
import { SectionOuterContainer } from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import getFullCategories from '@/actions/categories/getFullCategories';
import createMetaData from '@/lib/createMetaData';
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

type Props = {
	params: { slug: string };
	searchParams: { [key: string]: string | undefined };
};

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params

export async function generateStaticParams() {
	const supabase = createSupabaseBrowserClient();
	const { data: categoryData } = await supabase.rpc(
		'get_full_active_categories'
	);
	if (!categoryData) return [];
	return categoryData.map((category) => ({ slug: category.slug }));
}

// https://nextjs.org/docs/app/building-your-application/optimizing/metadata

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const categoriesData = await getFullCategories('active');
	const categoryData = categoriesData.data.find((c) => c.slug === params.slug);

	if (!categoryData) {
		return createMetaData({
			customTitle: 'Category Directory',
			customDescription: `This category is used on ${COMPANY_BASIC_INFORMATION.NAME} to cluster listings. Find everything you need to know about this category here on ${COMPANY_BASIC_INFORMATION.NAME}.`,
		});
	}

	return createMetaData({
		customTitle: `${categoryData.name} Directory`,
		customDescription: categoryData.description ?? undefined,
		customTags: [categoryData.name, 'directory'],
		customSlug: `category/${categoryData.slug}`,
	});
}

export default async function Page({ params, searchParams }: Props) {
	const categoriesData = await getFullCategories('active');

	const category = categoriesData.data.find((t) => t.slug === params.slug);

	if (!category) {
		notFound();
	}

	return (
		<SectionOuterContainer className="max-w-5xl mx-auto py-0 pb-12">
			<CategoryBar
				hrefPrefix="/category/"
				text="Other Categories"
				className="self-start"
				badgeClassName="hover:bg-muted/60"
			/>

			<CategoryHero category={category} />

			<ListingOverview
				categoryNavigation={false}
				filterAndSortParams={{
					category: params.slug,
					sort: searchParams.sort ?? 'newest',
					tags: searchParams.tags ?? '',
				}}
				maxNumListings={100}
				maxCols={3}
				preferPromoted
				className="py-0 md:py-0"
			/>

			<AdSlot slot={`${params.slug}-2`} />
		</SectionOuterContainer>
	);
}
