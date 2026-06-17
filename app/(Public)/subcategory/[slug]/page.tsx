// Import Types
import { Metadata } from 'next/types';
// Import External Packages
import { notFound } from 'next/navigation';
// Import Components
import AdSlot from '@/components/ads/AdSlot';
import SubcategoryHero from '@/components/subcategories/SubcategoryHero';
import SublistingOverview from '@/components/sublistings/SublistingOverview';
import { SectionOuterContainer } from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import createMetaData from '@/lib/createMetaData';
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { getFullSubcategories } from '@/actions/subcategories';
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
	const { data: subcategoryData } = await supabase.rpc(
		'get_full_active_subcategories'
	);
	if (!subcategoryData) return [];
	return subcategoryData.map((subcategory) => ({ slug: subcategory.slug }));
}

// https://nextjs.org/docs/app/building-your-application/optimizing/metadata

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const categoriesData = await getFullSubcategories('active');
	const subcategoryData = categoriesData.data.find(
		(c) => c.slug === params.slug
	);

	if (!subcategoryData) {
		return createMetaData({
			customTitle: 'Subcategory Directory',
			customDescription: `This subcategory is used on ${COMPANY_BASIC_INFORMATION.NAME} to cluster listings. Find everything you need to know about this subcategory here on ${COMPANY_BASIC_INFORMATION.NAME}.`,
		});
	}

	return createMetaData({
		customTitle: `${subcategoryData.name} Directory`,
		customDescription: subcategoryData.description ?? undefined,
		customTags: [subcategoryData.name, 'directory'],
		customSlug: `subcategory/${subcategoryData.slug}`,
	});
}

export default async function Page({ params, searchParams }: Props) {
	const categoriesData = await getFullSubcategories('active');

	const subcategory = categoriesData.data.find((t) => t.slug === params.slug);

	if (!subcategory) {
		notFound();
	}

	return (
		<SectionOuterContainer className="max-w-5xl mx-auto py-0 pb-12">
			<SubcategoryHero subcategory={subcategory} />
			<SublistingOverview
				categoryNavigation={false}
				filterAndSortParams={{
					subcategory: params.slug,
					sort: searchParams.sort ?? 'newest',
					tags: searchParams.tags ?? '',
				}}
				maxNumSublistings={100}
				maxCols={3}
				preferPromoted
				className="py-0 md:py-0"
			/>

			<AdSlot slot={`${params.slug}-2`} />
		</SectionOuterContainer>
	);
}
