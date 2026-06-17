// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import AdEditor from '../_components/AdEditor';
// Import Functions & Actions & Hooks & State
import getAdByAdId from '@/actions/ads/getAdByAdId';
import serverAuth from '@/actions/auth/serverAuth';
import getPartialCategories from '@/actions/categories/getPartialCategories';
// Import Data
import { ADDITIONAL_AD_SLOTS, COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Ad Editor`,
};

export default async function AdEditorPage({
	params,
}: {
	params: { adId: string };
}) {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: adData, success: loadSuccess } = await getAdByAdId(params.adId);

	if (!loadSuccess) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your Ad cannot be found. <br /> Did you click a button
						and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const categoryData = await getPartialCategories('all');

	const adSlots = categoryData.data
		.flatMap((category) => [`${category.slug}-1`, `${category.slug}-2`])
		.concat(ADDITIONAL_AD_SLOTS);

	return (
		<SectionOuterContainer>
			<SectionTitle>Update Ad</SectionTitle>
			<AdEditor ad={adData} slotChoices={adSlots} />
		</SectionOuterContainer>
	);
}
