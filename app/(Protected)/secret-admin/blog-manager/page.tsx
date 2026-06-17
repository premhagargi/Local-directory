// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
import Link from 'next/link';
// Import Components
import TopicEditModal from './_components/TopicEditModal';
import BlogPostTable from '@/components/blog/BlogPostTable';
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import { buttonVariants } from '@/ui/Button';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getPosts_ALL_ADMIN from '@/actions/blog/getPosts_ALL_ADMIN';
import { getBlogTopics } from '@/actions/blog/getBlogTopics';
import { cn } from '@/utils';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons
import { PlusIcon } from 'lucide-react';
import TopicTable from './_components/TopicTable';

export const metadata: Metadata = {
	title: `Admin Area: Blog Manager`,
};

export default async function BlogManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const { data: postData } = await getPosts_ALL_ADMIN();
	const { data: topicData } = await getBlogTopics('all');

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<div className="flex justify-end space-x-2">
				<Link
					href="/account/new-post"
					className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
				>
					<PlusIcon className="h-4 w-4" />
					New Post
				</Link>
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Blog Posts</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all blog posts. You can update
						a blog post by clicking on the &apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{postData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									No Blog Posts
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your posts here, once you add them.
								</p>

								<Link
									href="/account/new-post"
									className={cn(
										buttonVariants({ variant: 'default', size: 'lg' }),
										'my-4'
									)}
								>
									Add Post
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
							<BlogPostTable blogPosts={postData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="w-full h-4 border-b border-neutral-200 border-dotted" />
			<div className="flex justify-end space-x-2">
				<TopicEditModal topic={null} />
			</div>
			<Card>
				<CardHeader>
					<SectionTitle>Blog Topics</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all blog topics. Each blog
						post is associated with 1 topic. You can update a topic by clicking
						on the &apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{topicData && topicData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no topics!
								</h3>
								<p className="text-sm text-muted-foreground">
									We will display your blog topics here, once you add them.
								</p>

								<TopicEditModal topic={null} />
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
							<TopicTable topics={topicData} />
						</Suspense>
					)}
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
