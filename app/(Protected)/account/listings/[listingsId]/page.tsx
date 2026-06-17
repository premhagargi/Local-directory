// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import ListingEditor from '@/components/listings/ListingEditor';
// Import Functions & Actions & Hooks & State
import getListingByListingId from '@/actions/listings/getListingByListingId';
import serverAuth from '@/actions/auth/serverAuth';
import getFullTags from '@/actions/tags/getFullTags';
import getPartialCategories from '@/actions/categories/getPartialCategories';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants'; // Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Listing Manager`,
};

export default async function ListingEditorPage({
	params,
}: {
	params: { listingsId: string };
}) {
	const { user, isSuperAdmin, error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
	});

	if (!user || error) {
		return error;
	}

	// Listings that need approval
	const listingData = await getListingByListingId(params.listingsId);

	if (!listingData.success) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your listing cannot be found. <br /> Did you click a
						button and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const tagData = await getFullTags('all');
	const categoryData = await getPartialCategories('all');

	return (
		<SectionOuterContainer>
			<SectionTitle className="mx-0 max-w-none text-left">
				Update Listing
			</SectionTitle>
			<ListingEditor
				listing={listingData.data}
				tagChoices={tagData.data}
				categoryChoices={categoryData.data}
				userId={user.id}
				isSuperAdmin={isSuperAdmin}
			/>
		</SectionOuterContainer>
	);
}
