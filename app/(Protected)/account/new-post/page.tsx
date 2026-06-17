// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import BlogPostEditor from '@/components/blog/BlogPostEditor';
// Import Functions & Actions & Hooks & State
import { getAllBlogTopics } from '@/actions/blog/getBlogTopics';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `New Post`,
};

export default async function NewPostPage() {
	const { user, isSuperAdmin, error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
	});

	if (!user || error) {
		return error;
	}

	const { data: topicData } = await getAllBlogTopics();

	return (
		<SectionOuterContainer>
			<SectionTitle className="mx-0 max-w-none text-left">
				New Blog Post
			</SectionTitle>
			<BlogPostEditor
				post={undefined}
				topicChoices={topicData}
				userId={user?.id}
				isSuperAdmin={isSuperAdmin}
			/>
		</SectionOuterContainer>
	);
}
