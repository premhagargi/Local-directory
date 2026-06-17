// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import SubcategoryEditor from '../_components/SubcategoryEditor';
// Import Functions & Actions & Hooks & State
import { getAllSubcategoryGroups } from '@/actions/subcategories/getSubcategoryGroups';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Subcategory Editor`,
};

export default async function SubcategoryAdderPage() {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: subcategoryGroups } = await getAllSubcategoryGroups();

	return (
		<SectionOuterContainer>
			<SectionTitle>Create a Subcategory</SectionTitle>

			<SubcategoryEditor
				subcategory={undefined}
				subcategoryGroups={subcategoryGroups}
			/>
		</SectionOuterContainer>
	);
}
