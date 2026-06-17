// Import Types
import { Metadata } from 'next';
// Import External Packages
import Link from 'next/link';
// Import Components
import {
	SectionDescription,
	SectionHeaderContainer,
	SectionOuterContainer,
	SectionTitle,
	SubSectionContentContainer,
	SubSectionInnerContainer,
	SubSectionOuterContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import getFullSubcategories from '@/actions/subcategories/getFullSubcategories';
import createMetaData from '@/lib/createMetaData';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

export const metadata: Metadata = createMetaData({
	customTitle: 'Categories',
	customDescription: `See all categories used on ${COMPANY_BASIC_INFORMATION.NAME}. Quickly find what you are looking for by clicking on a subcategory. Categories are used to categorize and filter listings.`,
	customSlug: `subcategory`,
});

const explanationOfCategories =
	'Categories are used to categorize and filter listings. Quickly find what you are looking for by clicking on a subcategory.';

export default async function Page() {
	const { data: subcategoryData } = await getFullSubcategories('active');
	return (
		<SectionOuterContainer>
			<SectionHeaderContainer>
				<SectionTitle>Browse all Categories</SectionTitle>
				<SectionDescription>{explanationOfCategories}</SectionDescription>
			</SectionHeaderContainer>
			<SubSectionOuterContainer>
				<SubSectionInnerContainer>
					<SubSectionContentContainer>
						<table className="table-auto">
							<thead>
								<tr className="table-row text-sm bg-muted">
									<th className="table-cell px-2 text-left align-middle text-lg font-semibold italic">
										Category
									</th>
									<th className="table-cell px-2 text-left align-middle text-lg font-semibold italic">
										Description
									</th>
								</tr>
							</thead>
							<tbody>
								{subcategoryData.map((subcategory) => (
									<tr key={subcategory.id} className="h-20">
										<td className="p-2 text-lg font-semibold whitespace-nowrap">
											<Link
												href={`/subcategory/${subcategory.slug}`}
												className="underline"
											>
												{subcategory.name}
											</Link>
										</td>
										<td className="p-2 text-base text-muted-foreground">
											{subcategory.description}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</SubSectionContentContainer>
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>
		</SectionOuterContainer>
	);
}
