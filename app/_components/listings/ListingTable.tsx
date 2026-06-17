'use client';
// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
import { useRouter } from 'next/navigation';
// Import Components
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/ui/HoverCard';
import { CardContent, CardFooter } from '@/ui/Card';
import SupabaseImage from '@/components/SupabaseImage';
import Pagination from '@/ui/Pagination';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Badge } from '@/ui/Badge';
// Import Functions & Actions & Hooks & State
import usePagination from '@/lib/usePagination';
// Import Data
// Import Assets & Icons
import { CircleHelp } from 'lucide-react';

/**
 * A table component that displays listings.
 * @param listings - The listings to display.
 */
export default function ListingTable({
	listings,
}: {
	listings: ListingType[];
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
		data: listings,
		searchField: 'title',
	});

	const Router = useRouter();

	return (
		<div className="grid">
			<div className="w-full flex justify-end">
				<Input
					className="w-58"
					placeholder="Search listing by name..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>

			<div className="table table-auto w-full mt-6">
				<CardContent>
					<div className="table table-fixed w-full">
						<div className="table-header-group">
							<div className="table-row text-sm">
								<div className="hidden sm:table-cell w-24 h-10 px-2 text-left align-middle font-medium border-b-2 border-neutral-200">
									{''}
								</div>
								<div className="table-cell h-10 px-2 text-left align-middle font-medium border-b-2 border-neutral-200">
									Name
								</div>
								<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium border-b-2 border-neutral-200">
									Excerpt
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
																	<Badge variant="outline">active</Badge>
																	<br />
																	or
																	<br />
																	<Badge variant="destructive">inactive</Badge>
																</div>
																<div className="p-2">
																	Whether <span className="font-bold">WE</span>{' '}
																	have approved your published listing or not.
																	(Takes 24h usually)
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
							{currentData.map((listing) => (
								<div
									key={listing.id}
									className="table-row h-auto hover:bg-muted/40 hover:cursor-pointer"
									onClick={() => {
										Router.push(`/account/listings/${listing.id}`);
									}}
								>
									<div className="hidden sm:table-cell w-24 p-2 border-b-2 border-neutral-200">
										<SupabaseImage
											dbImageUrl={listing.default_image_url}
											database="listing_images"
											width={900}
											height={600}
											className="h-12 w-24 relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800"
											priority={false}
										/>
									</div>
									<div className="table-cell content-center font-medium p-2 align-middle border-b-2 border-neutral-200">
										{listing.title}
									</div>
									<div className="hidden sm:table-cell content-center p-2 text-xs text-muted-foreground overflow-hidden border-b-2 border-neutral-200">
										{listing.excerpt
											? listing.excerpt.slice(0, 50)
											: listing.excerpt}{' '}
										...
									</div>

									<div className="hidden sm:table-cell content-center p-2 space-x-1 border-b-2 border-neutral-200">
										<Badge
											variant={
												listing.is_user_published ? 'outline' : 'destructive'
											}
										>
											{listing.is_user_published ? 'published' : 'draft'}
										</Badge>
										<span className="text-muted-foreground text-xs">&</span>
										<Badge
											variant={
												listing.is_admin_published ? 'outline' : 'destructive'
											}
										>
											{listing.is_admin_published ? 'active' : 'inactive'}
										</Badge>
									</div>

									<div className="table-cell content-center p-2 border-b-2 border-neutral-200">
										<Button
											variant="outline"
											onClick={() => {
												Router.push(`/account/listings/${listing.id}`);
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
						totalItems={listings.length}
						paginateBack={paginateBack}
						paginateFront={paginateFront}
						paginateBackFF={paginateBackFF}
						paginateFrontFF={paginateFrontFF}
						currentPage={currentPage}
						totalPages={totalPages}
						setItemsPerPage={setItemsPerPage}
						pageSizeOptions={[5, 10, 25, 50]}
						nameOfItems="listings"
					/>
				</CardFooter>
			</div>
		</div>
	);
}
