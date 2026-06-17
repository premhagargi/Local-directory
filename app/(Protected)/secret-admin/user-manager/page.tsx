// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import UserTable from './_components/UserTable';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getUsers_ADMIN from '@/actions/users/getUsers_ADMIN';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Admin Area: User Manager`,
};

export default async function UserManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const userObject = await getUsers_ADMIN();

	if (!userObject.success) {
		return (
			<div>There was an error fetching users. Try reloading the page.</div>
		);
	}

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<Card>
				<CardHeader>
					<SectionTitle>User Manager</SectionTitle>
					<CardDescription>
						Find an overview of all users in the system. You can see their email
						and activate or deactivate their account. Deactivating a user means
						that they will not be able to login. If you want to delete a user,
						do so in the database. Then you can also remove their listings and
						blog posts.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<UserTable users={userObject.data} />
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
