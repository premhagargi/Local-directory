// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import ListingEditor from '@/components/listings/ListingEditor';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import getPartialCategories from '@/actions/categories/getPartialCategories';
import serverAuth from '@/actions/auth/serverAuth';
import getFullTags from '@/actions/tags/getFullTags';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `New Listing`,
};

export default async function NewListingPage() {
	const { user, isSuperAdmin, error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
	});

	if (!user || error) {
		return error;
	}

	const tagData = await getFullTags('all');
	const categoryData = await getPartialCategories('all');

	return (
		<SectionOuterContainer>
			<SectionTitle>New Listing</SectionTitle>
			<ListingEditor
				listing={undefined}
				tagChoices={tagData.data}
				categoryChoices={categoryData.data}
				userId={user?.id}
				isSuperAdmin={isSuperAdmin}
			/>
		</SectionOuterContainer>
	);
}
