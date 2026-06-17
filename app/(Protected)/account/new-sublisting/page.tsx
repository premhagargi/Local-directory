// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import SublistingEditor from '@/components/sublistings/SublistingEditor';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import getPartialSubcategories from '@/actions/subcategories/getPartialSubcategories';
import serverAuth from '@/actions/auth/serverAuth';
import getFullSubtags from '@/actions/subtags/getFullSubtags';
import getListingsByUserId from '@/actions/listings/getListingsByUserId';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `New Sublisting`,
};

export default async function NewSublistingPage() {
	const { user, isSuperAdmin, error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
	});

	if (!user || error) {
		return error;
	}

	const subtagData = await getFullSubtags('all');
	const SubcategoryData = await getPartialSubcategories('all');
	const listingData = await getListingsByUserId(user.id);

	return (
		<SectionOuterContainer>
			<SectionTitle className="mx-0 max-w-none text-left">
				New Sublisting
			</SectionTitle>
			<SublistingEditor
				sublisting={undefined}
				subtagChoices={subtagData.data}
				subcategoryChoices={SubcategoryData.data}
				listingChoices={listingData.data}
				userId={user?.id}
				isSuperAdmin={isSuperAdmin}
			/>
		</SectionOuterContainer>
	);
}
