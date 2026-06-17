// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import BlogPostEditor from '@/components/blog/BlogPostEditor';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
// Import Functions & Actions & Hooks & State
import { getAllBlogTopics } from '@/actions/blog/getBlogTopics';
import getPostsByPostId from '@/actions/blog/getPostsByPostId';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants'; // Import Assets & Icons
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
	title: `Post Manager`,
};

export default async function BlogPostEditorPage({
	params,
}: {
	params: { postId: string };
}) {
	const { user, isSuperAdmin, error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
	});

	if (!user || error) {
		return error;
	}

	// Post Data
	const { data: postData, success } = await getPostsByPostId(params.postId);

	if (!success) {
		return (
			<div className="w-full h-full flex items-center">
				<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>
						It seems like your post cannot be found. <br /> Did you click a
						button and arrive here? <br /> If so, please contact support:{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}. Thank you!
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const { data: topicData } = await getAllBlogTopics();

	return (
		<SectionOuterContainer>
			<SectionTitle className="mx-0 max-w-none text-left">
				Update Post
			</SectionTitle>
			<BlogPostEditor
				post={postData}
				topicChoices={topicData}
				userId={user?.id}
				isSuperAdmin={isSuperAdmin}
			/>
		</SectionOuterContainer>
	);
}
