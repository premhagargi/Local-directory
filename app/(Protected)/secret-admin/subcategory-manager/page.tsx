// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
import Link from 'next/link';
// Import Components
import SubcategoryGroupModal from './_components/SubcategoryGroupModal';
import SubcategoryGroupTable from './_components/SubcategoryGroupTable';
import SubcategoryTable from './_components/SubcategoryTable';
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { buttonVariants } from '@/ui/Button';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import { getSubcategoryGroups } from '@/actions/subcategories/getSubcategoryGroups';
import getFullSubcategories from '@/actions/subcategories/getFullSubcategories';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/utils';
// Import Data
// Import Assets & Icons
import { PlusIcon } from 'lucide-react';

export const metadata: Metadata = {
	title: `Admin Area: Subcategory Manager`,
};

export default async function SubcategoryManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const { data: subcategoryData } = await getFullSubcategories('all');
	const { data: subcategoryGroupData } = await getSubcategoryGroups();

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<div className="flex justify-end space-x-2">
				<Link
					href="/secret-admin/subcategory-manager/new"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Subcategory
				</Link>
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Subcategory Manager</SectionTitle>
					<CardDescription>
						Here you can add, edit, and delete subcategories. Each listing can
						be assigned to exactly 1 subcategory.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{subcategoryData && subcategoryData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no subcategories!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your subcategories here, once you add them.
								</p>

								<Link
									href="/secret-admin/subcategory-manager/new"
									className={cn(
										buttonVariants({ variant: 'default', size: 'sm' })
									)}
								>
									<PlusIcon className="h-4 w-4" />
									New Subcategory
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
							<SubcategoryTable subcategories={subcategoryData} />
						</Suspense>
					)}
				</CardContent>
			</Card>

			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="flex justify-end space-x-2">
				<SubcategoryGroupModal subcategoryGroup={null} />
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Subcategory Groups</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all subcategory groups. Each
						subcategory is associated with 0, 1 or multiple subcategory groups.
						You can update a subcategory group by clicking on the
						&apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{subcategoryGroupData && subcategoryGroupData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no subcategory groups!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your subcategory groups here, once you add
									them.
								</p>

								<SubcategoryGroupModal subcategoryGroup={null} />
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
							<SubcategoryGroupTable subcategoryGroups={subcategoryGroupData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
