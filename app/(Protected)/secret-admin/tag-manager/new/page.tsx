// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import TagEditor from '../_components/TagEditor';
// Import Functions & Actions & Hooks & State
import { getAllTagGroups } from '@/actions/tags/getTagGroups';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Tag Editor`,
};

export default async function TagAdderPage() {
	const { error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
		mustBeAdmin: true,
	});

	if (error) {
		return error;
	}

	const { data: tagGroups } = await getAllTagGroups();

	return (
		<SectionOuterContainer>
			<SectionTitle>Create a Tag</SectionTitle>

			<TagEditor tag={undefined} tagGroups={tagGroups} />
		</SectionOuterContainer>
	);
}
