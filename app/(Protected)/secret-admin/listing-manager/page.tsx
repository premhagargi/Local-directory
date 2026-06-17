// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
import Link from 'next/link';
// Import Components
import ListingTable from '@/components/listings/ListingTable';
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import { buttonVariants } from '@/ui/Button';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getListings_ALL_ADMIN from '@/actions/listings/getListings_ALL_ADMIN';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/utils';
// Import Data
// Import Assets & Icons
import { PlusIcon } from 'lucide-react';

export const metadata: Metadata = {
	title: `Admin Area: Listing Manager`,
};

export default async function ListingManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const { data: listingData } = await getListings_ALL_ADMIN();

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 px-6 sm:px-0 py-6">
			<div className="flex justify-end space-x-2">
				<Link
					href="/account/new-listing"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Listing
				</Link>
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>All Listings</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all listings. You can update a
						listing by clicking on the &apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{listingData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									No listings on the platform.
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your listings here, once you add them.
								</p>

								<Link
									href="/account/new-listing"
									className={cn(
										buttonVariants({ variant: 'default', size: 'lg' }),
										'my-4'
									)}
								>
									Add Listing
								</Link>
							</div>
						</div>
					) : (
						<Suspense
							fallback={
								<ComponentMultiplier
									component={<Skeleton className="w-full h-[40px]" />}
									multiplier={1}
								/>
							}
						>
							<ListingTable listings={listingData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
