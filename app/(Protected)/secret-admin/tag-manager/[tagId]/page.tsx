// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import TagEditor from '../_components/TagEditor';
// Import Functions & Actions & Hooks & State
import { getAllTagGroups } from '@/actions/tags/getTagGroups';
import serverAuth from '@/actions/auth/serverAuth';
import getTagByTagId from '@/actions/tags/getTagByTagId';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Tag Updater`,
};

export default async function TagUpdaterPage({
	params,
}: {
	params: { tagId: string };
}) {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: tagData, success: loadSuccess } = await getTagByTagId(
		params.tagId
	);

	const { data: tagGroups } = await getAllTagGroups();

	if (!loadSuccess) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your Tag cannot be found. <br /> Did you click a
						button and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<SectionOuterContainer>
			<SectionTitle>Update a Tag</SectionTitle>

			<TagEditor tag={tagData} tagGroups={tagGroups} />
		</SectionOuterContainer>
	);
}
