// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import LeadTable from '../components/LeadTable';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getLeadsByOwnerId from '../actions/getLeadsByOwnerId';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Admin Area: Lead Manager`,
};

export default async function LeadManagerPage() {
	const { user, error } = await serverAuth({
		mustBeSignedIn: true,
	});

	if (!user || error) {
		return error;
	}

	const { data: leadData } = await getLeadsByOwnerId(user.id);

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<Card className="max-w-[95vw] sm:max-w-none mx-auto sm:mx-0">
				<CardHeader>
					<SectionTitle>Lead Manager</SectionTitle>
					<CardDescription>See all leads sent by users to you.</CardDescription>
				</CardHeader>

				<CardContent className="overflow-x-auto">
					{leadData ? (
						<LeadTable leads={leadData} />
					) : (
						<div>
							There was an error fetching the leads. Please refresh the page.
						</div>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
