// Import Types
import { Metadata } from 'next';
// Import External Packages
import Link from 'next/link';
// Import Components
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import ReloadDataButton from '@/components/Button_ReloadData';
import { buttonVariants } from '@/ui/Button';
import AdTable from './_components/AdTable';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getAds_ALL_ADMIN from '@/actions/ads/getAds_ALL_ADMIN';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/utils';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
// Import Types
import { AlertCircle, PlusIcon } from 'lucide-react';

export const metadata: Metadata = {
	title: `Admin Area: Ad Manager`,
};

export default async function AdManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const { data: adData, success } = await getAds_ALL_ADMIN();

	if (!success) {
		return <div>There was an error fetching the ads.</div>;
	}

	const areAdsEnabled = GENERAL_SETTINGS.USE_ADS;

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			{!areAdsEnabled && (
				<div className="w-full h-full flex items-center my-12">
					<Alert variant="destructive" className="bg-white w-fit h-fit mx-auto">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Heads up!</AlertTitle>
						<AlertDescription>
							Ads are currently disabled and will not be shown to website
							visitors. Enable them in the source code: constants.ts - General
							Settings - USE_ADS = TRUE.
						</AlertDescription>
					</Alert>
				</div>
			)}
			<div className="flex justify-end space-x-2">
				<Link
					href="/secret-admin/ad-manager/new"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Ad
				</Link>
				<ReloadDataButton />
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Ad Manager</SectionTitle>
					<CardDescription>
						See all ads. Click on an ad to edit it.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<AdTable ads={adData} />
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
