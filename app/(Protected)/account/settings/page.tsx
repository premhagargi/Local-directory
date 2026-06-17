// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
// Import Components
import AccountForm from './AccountForm';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Card, CardHeader, CardDescription, CardContent } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { CircleUserRoundIcon } from 'lucide-react';

export const metadata: Metadata = {
	title: `Settings`,
};

export default async function AccountPage() {
	const { user, error } = await serverAuth({
		mustBeSignedIn: true,
	});

	if (!user || error) {
		return error;
	}

	return (
		<SectionOuterContainer className="max-w-5xl">
			<Card className="w-full">
				<CardHeader>
					<SectionTitle className="mx-0 max-w-none text-left">
						Account Settings
					</SectionTitle>
					<CardDescription>
						Please contact us at {COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL} if
						you need any support or want to change your email.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Suspense fallback={<CircleUserRoundIcon />}>
						<AccountForm userId={user.id} />
					</Suspense>
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
