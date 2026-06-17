// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import ActivityTable from './_components/ActivityTable';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import serverAuth from '@/actions/auth/serverAuth';
import getActivities from '@/actions/activites/getActivities';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Admin Area: Activity Manager`,
};

function removeSpecialCharacters(str: string) {
	return str.replace(/[^\w\s]/gi, '').trim();
}

export default async function ActivityManagerPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const itemsPerPage = Math.min(
		searchParams.ipp ? parseInt(searchParams.ipp) : 10,
		100
	);
	const page = searchParams.page
		? parseInt(removeSpecialCharacters(searchParams.page))
		: 1;

	const typeFilter = searchParams.type
		? searchParams.type !== 'all'
			? removeSpecialCharacters(searchParams.type)
			: 'all'
		: 'all';

	const activitiesObject = await getActivities(
		itemsPerPage,
		(page - 1) * itemsPerPage,
		typeFilter
	);

	if (!activitiesObject.success) {
		return (
			<div>
				There was an error fetching the activities. Try reloading the page.
			</div>
		);
	}

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<Card>
				<CardHeader>
					<SectionTitle>Activity Manager</SectionTitle>
					<CardDescription>
						Here you will find everything that is happening in your app!
					</CardDescription>
				</CardHeader>

				<CardContent>
					<ActivityTable
						activities={activitiesObject.data}
						totalSizeOfCurrentDataChunk={activitiesObject.count || 0}
					/>
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
