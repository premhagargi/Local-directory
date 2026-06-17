// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import AdEditor from '../_components/AdEditor';
// Import Functions & Actions & Hooks & State
import serverAuth from '@/actions/auth/serverAuth';
import getPartialCategories from '@/actions/categories/getPartialCategories';
// Import Data
import { ADDITIONAL_AD_SLOTS, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Ad Adder`,
};

export default async function AdAdderPage() {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const categoryData = await getPartialCategories('all');

	const adSlots = categoryData.data
		.flatMap((category) => [`${category.slug}-1`, `${category.slug}-2`])
		.concat(ADDITIONAL_AD_SLOTS);

	const areAdsEnabled = GENERAL_SETTINGS.USE_ADS;

	return (
		<SectionOuterContainer>
			<SectionTitle>Create an Ad</SectionTitle>
			{!areAdsEnabled && (
				<div className="w-full h-full flex items-center my-12">
					<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Heads up!</AlertTitle>
						<AlertDescription>
							Ads are currently disabled and will not be shown to website
							visitors. Enable them in the source code: constants.ts - General
							Settings - USE_ADS = TRUE.
						</AlertDescription>
					</Alert>
				</div>
			)}
			<AdEditor ad={undefined} slotChoices={adSlots} />
		</SectionOuterContainer>
	);
}
