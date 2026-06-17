// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
import Link from 'next/link';
// Import Components
import CategoryGroupModal from './_components/CategoryGroupModal';
import CategoryGroupTable from './_components/CategoryGroupTable';
import CategoryTable from './_components/CategoryTable';
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { buttonVariants } from '@/ui/Button';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import { getCategoryGroups } from '@/actions/categories/getCategoryGroups';
import getFullCategories from '@/actions/categories/getFullCategories';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/utils';
// Import Data
// Import Assets & Icons
import { PlusIcon } from 'lucide-react';

export const metadata: Metadata = {
	title: `Admin Area: Category Manager`,
};

export default async function CategoryManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const { data: categoryData } = await getFullCategories('all');
	const { data: categoryGroupData } = await getCategoryGroups();

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<div className="flex justify-end space-x-2">
				<Link
					href="/secret-admin/category-manager/new"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Category
				</Link>
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Category Manager</SectionTitle>
					<CardDescription>
						Here you can add, edit, and delete categories. Each listing can be
						assigned to exactly 1 category.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{categoryData && categoryData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no categories!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your categories here, once you add them.
								</p>

								<Link
									href="/secret-admin/category-manager/new"
									className={cn(
										buttonVariants({ variant: 'default', size: 'sm' })
									)}
								>
									<PlusIcon className="h-4 w-4" />
									New Category
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
							<CategoryTable categories={categoryData} />
						</Suspense>
					)}
				</CardContent>
			</Card>

			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="flex justify-end space-x-2">
				<CategoryGroupModal categoryGroup={null} />
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Category Groups</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all category groups. Each
						category is associated with 0, 1 or multiple category groups. You
						can update a category group by clicking on the
						&apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{categoryGroupData && categoryGroupData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no category groups!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your category groups here, once you add them.
								</p>

								<CategoryGroupModal categoryGroup={null} />
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
							<CategoryGroupTable categoryGroups={categoryGroupData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
