'use client';
// Import Types
import { Tables } from '@/supabase-types';
// Import External Packages
import { useRouter } from 'next/navigation';
// Import Components
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/ui/HoverCard';
import { CardContent, CardFooter } from '@/ui/Card';
import Pagination from '@/ui/Pagination';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Badge } from '@/ui/Badge';
// Import Functions & Actions & Hooks & State
import usePagination from '@/lib/usePagination';
import { formatDate } from '@/lib/utils';
// Import Data
// Import Assets & Icons
import { CircleHelp } from 'lucide-react';

/**
 * A table component that displays blog post overviews for further managament.
 * @param blogPosts - The blog posts to display.
 */
export default function BlogPostTable({
	blogPosts,
}: {
	blogPosts: Tables<'blog_posts'>[];
}) {
	const {
		currentData,
		currentPage,
		totalPages,
		itemsPerPage,
		paginateBack,
		paginateFront,
		paginateBackFF,
		paginateFrontFF,
		setItemsPerPage,
		setSearchTerm,
	} = usePagination({
		initialItemsPerPage: 5,
		data: blogPosts,
		searchField: 'title',
	});

	const Router = useRouter();

	return (
		<div className="grid">
			<div className="w-full flex justify-end">
				<Input
					className="w-72"
					placeholder="Search blog post by title..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>

			<div className="table table-auto w-full mt-6">
				<CardContent>
					<div className="table table-fixed w-full">
						<div className="table-header-group">
							<div className="table-row text-sm">
								<div className="table-cell h-10 px-2 text-left align-middle font-medium border-b-2 border-neutral-200">
									Title
								</div>
								<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium border-b-2 border-neutral-200">
									Publish Date
								</div>
								<div className="hidden sm:table-cell h-10 px-2 text-left align-middle content-center font-medium border-b-2 border-neutral-200">
									<span className="inline-flex">
										Status
										<span className="pl-1">
											<HoverCard>
												<HoverCardTrigger>
													<CircleHelp size={18} />
												</HoverCardTrigger>
												<HoverCardContent>
													Legend
													<table className="w-full border">
														<tbody>
															<tr className="border">
																<div className="p-2">
																	<Badge variant="outline">published</Badge>
																	<br />
																	or
																	<br />
																	<Badge variant="destructive">draft</Badge>
																</div>
																<div className="p-2">
																	Whether <span className="font-bold">YOU</span>{' '}
																	have published the listing or not.
																</div>
															</tr>{' '}
															<tr className="border">
																<div className="p-2">
																	{' '}
																	<Badge variant="outline">aproved</Badge>
																	<br />
																	or
																	<br />
																	<Badge variant="destructive">pending</Badge>
																</div>
																<div className="p-2">
																	Whether <span className="font-bold">WE</span>{' '}
																	have approved your post or not. (Takes 24h
																	usually)
																</div>
															</tr>{' '}
														</tbody>{' '}
													</table>
												</HoverCardContent>
											</HoverCard>
										</span>
									</span>
								</div>

								<div className="table-cell w-24 h-10 px-2 text-left align-middle font-medium border-b-2 border-neutral-200">
									Edit
								</div>
							</div>
						</div>
						<div className="table-row-group">
							{currentData.map((blogPost) => (
								<div
									key={blogPost.id}
									className="table-row h-auto hover:bg-muted/40 hover:cursor-pointer"
									onClick={() => {
										Router.push(`/account/posts/${blogPost.id}`);
									}}
								>
									<div className="table-cell content-center font-medium p-2 align-middle border-b-2 border-neutral-200">
										{blogPost.title}
									</div>
									<div className="hidden sm:table-cell content-center font-normal text-sm p-2 align-middle border-b-2 border-neutral-200">
										{formatDate(
											blogPost.published_at
												? new Date(blogPost.published_at)
												: new Date()
										)}
									</div>

									<div className="hidden sm:table-cell content-center p-2 space-x-1 border-b-2 border-neutral-200">
										<Badge
											variant="outline"
											className={
												blogPost.is_user_published
													? 'w-fit bg-green-200'
													: 'w-fit bg-red-200'
											}
										>
											{blogPost.is_user_published ? 'Published' : 'Draft'}
										</Badge>
										<span className="text-muted-foreground text-xs">&</span>
										<Badge
											variant="outline"
											className={
												blogPost.is_admin_approved
													? 'w-fit bg-green-200'
													: 'w-fit bg-red-200'
											}
										>
											{blogPost.is_admin_approved
												? 'Admin Approved'
												: 'Admin Pending'}
										</Badge>
									</div>

									<div className="table-cell content-center p-2 border-b-2 border-neutral-200">
										<Button
											variant="outline"
											onClick={() => {
												Router.push(`/account/posts/${blogPost.id}`);
											}}
											size={'sm'}
										>
											Edit
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Pagination
						itemsPerPage={itemsPerPage}
						totalItems={blogPosts.length}
						paginateBack={paginateBack}
						paginateFront={paginateFront}
						paginateBackFF={paginateBackFF}
						paginateFrontFF={paginateFrontFF}
						currentPage={currentPage}
						totalPages={totalPages}
						setItemsPerPage={setItemsPerPage}
						pageSizeOptions={[5, 10, 25, 50]}
						nameOfItems="posts"
					/>
				</CardFooter>
			</div>
		</div>
	);
}
