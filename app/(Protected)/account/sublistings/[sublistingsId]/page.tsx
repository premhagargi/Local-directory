// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import SublistingEditor from '@/components/sublistings/SublistingEditor';
// Import Functions & Actions & Hooks & State
import getSublistingBySublistingId from '@/actions/sublistings/getSublistingBySublistingId';
import serverAuth from '@/actions/auth/serverAuth';
import getFullSubtags from '@/actions/subtags/getFullSubtags';
import getListingsByUserId from '@/actions/listings/getListingsByUserId';
import getPartialSubcategories from '@/actions/subcategories/getPartialSubcategories';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants'; // Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Sublisting Manager`,
};

export default async function SublistingEditorPage({
	params,
}: {
	params: { sublistingsId: string };
}) {
	const { user, isSuperAdmin, error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
	});

	if (!user || error) {
		return error;
	}

	// Sublistings that need approval
	const sublistingData = await getSublistingBySublistingId(
		params.sublistingsId
	);

	if (!sublistingData.success) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your sublisting cannot be found. <br /> Did you click
						a button and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const listingData = await getListingsByUserId(user.id);

	const subtagData = await getFullSubtags('all');
	const subcategoryData = await getPartialSubcategories('all');

	return (
		<SectionOuterContainer>
			<SectionTitle className="mx-0 max-w-none text-left">
				Update Sublisting
			</SectionTitle>
			<SublistingEditor
				sublisting={sublistingData.data}
				subtagChoices={subtagData.data}
				subcategoryChoices={subcategoryData.data}
				listingChoices={listingData.data}
				userId={user.id}
				isSuperAdmin={isSuperAdmin}
			/>
		</SectionOuterContainer>
	);
}
