// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
// Import Components
import TagGroupModal from './_components/TagGroupModal';
import TagTable from './_components/TagTable';
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { getTagGroups } from '@/actions/tags/getTagGroups';
import getFullTags from '@/actions/tags/getFullTags';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
// Import Types
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import TagGroupTable from './_components/TagGroupTable';

export const metadata: Metadata = {
	title: `Admin Area: Tag Manager`,
};

export default async function TagManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const tagData = await getFullTags('all');
	const { data: tagGroupData } = await getTagGroups();

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<div className="flex justify-end space-x-2">
				<Link
					href="/secret-admin/tag-manager/new"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Tag
				</Link>
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Tag Manager</SectionTitle>
					<CardDescription>
						Here you can add, edit, and delete tags. Each listing can be
						assigned to multiple tags.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{tagData && tagData.data.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no tags!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your tags here, once you add them.
								</p>

								<Link
									href="/secret-admin/tag-manager/new"
									className={cn(
										buttonVariants({ variant: 'default', size: 'sm' })
									)}
								>
									<PlusIcon className="h-4 w-4" />
									New Tag
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
							<TagTable tags={tagData.data} />
						</Suspense>
					)}
				</CardContent>
			</Card>

			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="flex justify-end space-x-2">
				<TagGroupModal tagGroup={null} />
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Tag Groups</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all tag groups. Each tag is
						associated with 0, 1 or multiple tag groups. You can update a tag
						group by clicking on the &apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{tagGroupData && tagGroupData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no tag groups!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your tag groups here, once you add them.
								</p>

								<TagGroupModal tagGroup={null} />
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
							<TagGroupTable tagGroups={tagGroupData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
