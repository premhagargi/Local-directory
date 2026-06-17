// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
// Import Components
import SubtagGroupModal from './_components/SubtagGroupModal';
import SubtagTable from './_components/SubtagTable';
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import SubtagGroupTable from './_components/SubtagGroupTable';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { getSubtagGroups } from '@/actions/subtags/getSubtagGroups';
import getFullSubtags from '@/actions/subtags/getFullSubtags';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
// Import Types
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
	title: `Admin Area: Subtag Manager`,
};

export default async function SubtagManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const subtagData = await getFullSubtags('all');
	const { data: subtagGroupData } = await getSubtagGroups();

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<div className="flex justify-end space-x-2">
				<Link
					href="/secret-admin/subtag-manager/new"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Subtag
				</Link>
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Subtag Manager</SectionTitle>
					<CardDescription>
						Here you can add, edit, and delete subtags. Each listing can be
						assigned to multiple subtags.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{subtagData && subtagData.data.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no subtags!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your subtags here, once you add them.
								</p>

								<Link
									href="/secret-admin/subtag-manager/new"
									className={cn(
										buttonVariants({ variant: 'default', size: 'sm' })
									)}
								>
									<PlusIcon className="h-4 w-4" />
									New Subtag
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
							<SubtagTable subtags={subtagData.data} />
						</Suspense>
					)}
				</CardContent>
			</Card>

			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="flex justify-end space-x-2">
				<SubtagGroupModal subtagGroup={null} />
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Subtag Groups</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all subtag groups. Each subtag
						is associated with 0, 1 or multiple subtag groups. You can update a
						subtag group by clicking on the &apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{subtagGroupData && subtagGroupData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no subtag groups!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your subtag groups here, once you add them.
								</p>

								<SubtagGroupModal subtagGroup={null} />
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
							<SubtagGroupTable subtagGroups={subtagGroupData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
