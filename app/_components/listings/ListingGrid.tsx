'use client';

// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import ListingCard from '@/components/listings/ListingCard';
import Pagination from '@/ui/Pagination';
import { Input } from '@/ui/Input';
// Import Functions & Actions & Hooks & State
import usePagination from '@/lib/usePagination';
import useClientAuth from '@/lib/useClientAuth';
// Import Data
// Import Assets & Icons
import { SearchX } from 'lucide-react';

export default function ListingGrid({
	listings,
	maxCols,
	showPagination,
	initialItemsPerPage,
	showSearch = true,
}: {
	listings: ListingType[];
	maxCols: number;
	showPagination?: boolean;
	initialItemsPerPage: number;
	showSearch?: boolean;
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
		initialItemsPerPage: initialItemsPerPage || maxCols * 2,
		data: listings,
		searchField: 'title',
	});

	const { userObject: user } = useClientAuth({});

	// Beautiful empty state
	const EmptyState = ({ message }: { message: string }) => (
		<div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
			<div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center mb-5 shadow-sm">
				<SearchX className="w-6 h-6 text-text-secondary" />
			</div>
			<h3 className="text-[16px] font-semibold text-foreground mb-2">
				No listings found
			</h3>
			<p className="text-[14px] text-text-secondary max-w-xs leading-relaxed">
				{message}
			</p>
		</div>
	);

	return (
		<>
			{listings.length === 0 ? (
				<EmptyState message="There are currently no listings available in this category. Check back soon!" />
			) : (
				<>
					{showSearch && (
						<div className="w-full flex justify-end mb-5">
							<Input
								className="w-52 h-8 text-sm rounded-full border-border bg-white"
								placeholder="Filter by name..."
								onChange={(e) => setSearchTerm(e.target.value || '')}
							/>
						</div>
					)}
					{currentData.length === 0 ? (
						<EmptyState message="No listings match your search. Try adjusting your filters." />
					) : (
						<div
							className={`grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8 w-full ${maxCols >= 3 ? 'xl:grid-cols-3' : ''}`}
						>
							{currentData.map((listing) => (
								<ListingCard key={listing.slug} listing={listing} user={user} />
							))}
						</div>
					)}
					{showPagination && (
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
							pageSizeOptions={[maxCols * 2, maxCols * 4, maxCols * 8]}
							nameOfItems="listings"
						/>
					)}
				</>
			)}
		</>
	);
}
