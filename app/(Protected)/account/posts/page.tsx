// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
import Link from 'next/link';
// Import Components
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import { buttonVariants } from '@/ui/Button';
import { Skeleton } from '@/ui/Skeleton';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { Card, CardHeader, CardDescription, CardContent } from '@/ui/Card';
import BlogPostTable from '@/components/blog/BlogPostTable';
// Import Functions & Actions & Hooks & State
import getPostsByUserId from '@/actions/blog/getPostsByUserId';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
import { PlusIcon } from 'lucide-react';

export const metadata: Metadata = {
	title: `Posts Overview`,
};

export default async function PostPage() {
	const { user, error } = await serverAuth({
		mustBeSignedIn: true,
	});

	if (!user || error) {
		return error;
	}

	const { data: postData } = await getPostsByUserId(user.id);

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
					<SectionTitle className="mx-0 max-w-none text-left">
						Your Blog Posts
					</SectionTitle>

					<CardDescription>
						Here, you&apos;ll find an overview of all your blog posts. You can
						update a blog post by clicking on the &apos;Edit&apos;-button.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{postData.length === 0 ? (
						<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
							<div className="flex flex-col items-center gap-1 text-center">
								<h3 className="text-2xl font-bold tracking-tight">
									You have no posts
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
		</SectionOuterContainer>
	);
}
