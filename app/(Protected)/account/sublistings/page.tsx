// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
import Link from 'next/link';
// Import Components
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import SublistingTable from '@/components/sublistings/SublistingTable';
import { buttonVariants } from '@/ui/Button';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import getSublistingsByFinderId from '@/actions/sublistings/getSublistingsByFinderId';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/lib/utils';
import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
} from '@/components/_ui/Card';
import { PlusIcon } from 'lucide-react';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Sublistings Overview`,
};

export default async function SublistingPage() {
	const { user, error } = await serverAuth({
		mustBeSignedIn: true,
		checkAdmin: true,
	});

	if (!user || error) {
		return error;
	}

	// Sublistings that belong to the user
	const { data: sublistingData } = await getSublistingsByFinderId(user.id);

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 px-6 sm:px-0 py-6">
			<div className="flex justify-end space-x-2">
				<Link
					href="/account/new-sublisting"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Sublisting
				</Link>
			</div>
			<Card>
				<CardHeader>
					<SectionTitle className="mx-0 max-w-none text-left">
						Your Sublistings
					</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all your sublistings. You can
						update a sublisting by clicking on the &apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{sublistingData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no sublistings
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your sublistings here, once you add them.
								</p>

								<Link
									href="/account/new-sublisting"
									className={cn(
										buttonVariants({ variant: 'default', size: 'lg' }),
										'my-4'
									)}
								>
									Add Sublisting
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
							<SublistingTable sublistings={sublistingData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
