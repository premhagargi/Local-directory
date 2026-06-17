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
import getFullSubtags from '@/actions/subtags/getFullSubtags';
import createMetaData from '@/lib/createMetaData';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

export const metadata: Metadata = createMetaData({
	customTitle: 'Subtags',
	customDescription: `See all subtags used on ${COMPANY_BASIC_INFORMATION.NAME}. Quickly find what you are looking for by clicking on a subtag. Subtags are used to categorize and filter all products.`,
	customSlug: `tag`,
});

const explanationOfTags =
	'Subtags are a way to categorize and filter all products. They are used to help you find what you are looking for. Click on a subtag to see all sublistings that have that subtag.';

export default async function Page() {
	const tagData = await getFullSubtags('active');

	return (
		<SectionOuterContainer>
			<SectionHeaderContainer>
				<SectionTitle>Browse all Subtags</SectionTitle>
				<SectionDescription>{explanationOfTags}</SectionDescription>
			</SectionHeaderContainer>
			<SubSectionOuterContainer>
				<SubSectionInnerContainer>
					<SubSectionContentContainer>
						<table className="table-auto">
							<thead>
								<tr className="table-row text-sm bg-muted">
									<th className="table-cell px-2 text-left align-middle text-lg font-semibold italic">
										Subtag
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
											<Link href={`/subtag/${tag.slug}`} className="underline">
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
