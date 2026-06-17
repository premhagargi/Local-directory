// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import SubtagEditor from '../_components/SubtagEditor';
// Import Functions & Actions & Hooks & State
import { getAllSubtagGroups } from '@/actions/subtags/getSubtagGroups';
import serverAuth from '@/actions/auth/serverAuth';
import getSubtagBySubtagId from '@/actions/subtags/getSubtagBySubtagId';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Subtag Updater`,
};

export default async function SubtagUpdaterPage({
	params,
}: {
	params: { subtagId: string };
}) {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: subtagData, success: loadSuccess } = await getSubtagBySubtagId(
		params.subtagId
	);

	const { data: subtagGroups } = await getAllSubtagGroups();

	if (!loadSuccess) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your Subtag cannot be found. <br /> Did you click a
						button and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<SectionOuterContainer>
			<SectionTitle>Update a Subtag</SectionTitle>

			<SubtagEditor subtag={subtagData} subtagGroups={subtagGroups} />
		</SectionOuterContainer>
	);
}
