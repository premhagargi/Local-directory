// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import CommentTable from './_components/CommentTable';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getComments_ALL_ADMIN from '@/actions/comments/getComments_ALL_ADMIN';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Admin Area: Comment Manager`,
};

export default async function CommentManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const { data: commentData } = await getComments_ALL_ADMIN();

	if (!commentData) {
		return <div>There was an error fetching the comments.</div>;
	}

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<Card>
				<CardHeader>
					<SectionTitle>Comment Manager</SectionTitle>
					<CardDescription>
						See all comments and approve or disapprove them.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<CommentTable comments={commentData} />
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
