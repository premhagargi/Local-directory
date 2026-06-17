// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import SubcategoryEditor from '../_components/SubcategoryEditor';
// Import Functions & Actions & Hooks & State
import { getAllSubcategoryGroups } from '@/actions/subcategories/getSubcategoryGroups';
import serverAuth from '@/actions/auth/serverAuth';
import getSubcategoryBySubcategoryId from '@/actions/subcategories/getSubcategoryBySubcategoryId';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Subcategory Updater`,
};

export default async function SubcategoryUpdaterPage({
	params,
}: {
	params: { subcategoryId: string };
}) {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: subcategoryData, success: loadSuccess } =
		await getSubcategoryBySubcategoryId(params.subcategoryId);

	const { data: subcategoryGroups } = await getAllSubcategoryGroups();

	if (!loadSuccess) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your Subcategory cannot be found. <br /> Did you click
						a button and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<SectionOuterContainer>
			<SectionTitle>Update a Subcategory</SectionTitle>

			<SubcategoryEditor
				subcategory={subcategoryData}
				subcategoryGroups={subcategoryGroups}
			/>
		</SectionOuterContainer>
	);
}
