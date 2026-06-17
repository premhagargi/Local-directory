// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import CategoryEditor from '../_components/CategoryEditor';
// Import Functions & Actions & Hooks & State
import { getAllCategoryGroups } from '@/actions/categories/getCategoryGroups';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Category Editor`,
};

export default async function CategoryAdderPage() {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: categoryGroups } = await getAllCategoryGroups();

	return (
		<SectionOuterContainer>
			<SectionTitle>Create a Category</SectionTitle>

			<CategoryEditor category={undefined} categoryGroups={categoryGroups} />
		</SectionOuterContainer>
	);
}
