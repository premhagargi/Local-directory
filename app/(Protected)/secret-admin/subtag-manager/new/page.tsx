// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import SubtagEditor from '../_components/SubtagEditor';
// Import Functions & Actions & Hooks & State
import { getAllSubtagGroups } from '@/actions/subtags/getSubtagGroups';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Subtag Editor`,
};

export default async function SubtagAdderPage() {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: subtagGroups } = await getAllSubtagGroups();

	return (
		<SectionOuterContainer>
			<SectionTitle>Create a Subtag</SectionTitle>

			<SubtagEditor subtag={undefined} subtagGroups={subtagGroups} />
		</SectionOuterContainer>
	);
}
