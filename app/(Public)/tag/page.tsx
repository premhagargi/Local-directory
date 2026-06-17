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
import getFullTags from '@/actions/tags/getFullTags';
import createMetaData from '@/lib/createMetaData';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

export const metadata: Metadata = createMetaData({
	customTitle: 'Tags',
	customDescription: `See all tags used on ${COMPANY_BASIC_INFORMATION.NAME}. Quickly find what you are looking for by clicking on a tag. Tags are used to categorize and filter listings.`,
	customSlug: `tag`,
});

const explanationOfTags =
	'Tags are a way to categorize and filter listings. They are used to help you find what you are looking for. Click on a tag to see all listings that have that tag.';

export default async function Page() {
	const tagData = await getFullTags('active');

	return (
		<SectionOuterContainer>
			<SectionHeaderContainer>
				<SectionTitle>Browse all Tags</SectionTitle>
				<SectionDescription>{explanationOfTags}</SectionDescription>
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
								{tagData.data.map((tag) => (
									<tr key={tag.id} className="h-20">
										<td className="p-2 text-lg font-semibold whitespace-nowrap">
											<Link href={`/tag/${tag.slug}`} className="underline">
												{tag.name}
											</Link>
										</td>
										<td className="p-2 text-base text-muted-foreground">
											{tag.description}
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
