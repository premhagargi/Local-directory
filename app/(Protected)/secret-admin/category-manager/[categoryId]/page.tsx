// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import CategoryEditor from '../_components/CategoryEditor';
// Import Functions & Actions & Hooks & State
import { getAllCategoryGroups } from '@/actions/categories/getCategoryGroups';
import serverAuth from '@/actions/auth/serverAuth';
import getCategoryByCategoryId from '@/actions/categories/getCategoryByCategoryId';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Category Updater`,
};

export default async function CategoryUpdaterPage({
	params,
}: {
	params: { categoryId: string };
}) {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: categoryData, success: loadSuccess } =
		await getCategoryByCategoryId(params.categoryId);

	const { data: categoryGroups } = await getAllCategoryGroups();

	if (!loadSuccess) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your Category cannot be found. <br /> Did you click a
						button and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<SectionOuterContainer>
			<SectionTitle>Update a Category</SectionTitle>

			<CategoryEditor category={categoryData} categoryGroups={categoryGroups} />
		</SectionOuterContainer>
	);
}
