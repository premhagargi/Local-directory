'use client';

// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
// Import Components
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import ListingCard from '@/components/listings/ListingCard';
import Pagination from '@/ui/Pagination';
import { Input } from '@/ui/Input';
// Import Functions & Actions & Hooks & State
import usePagination from '@/lib/usePagination';
import useClientAuth from '@/lib/useClientAuth';
// Import Data
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';

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

	return (
		<>
			{listings.length === 0 ? (
				<Alert
					variant="destructive"
					className="bg-white w-fit h-fit mx-auto col-span-full"
				>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Ohh!</AlertTitle>
					<AlertDescription>
						It seems like we did not find any listings given search parameters.{' '}
						<br /> Please change your filters. Thank you!
					</AlertDescription>
				</Alert>
			) : (
				<>
					{showSearch && (
						<div className="w-full flex justify-end mt-8 mb-4">
							<Input
								className="w-58"
								placeholder="Filter by name..."
								onChange={(e) => setSearchTerm(e.target.value || '')}
							/>
						</div>
					)}
					{currentData.length === 0 ? (
						<Alert
							variant="destructive"
							className="bg-white w-fit h-fit mx-auto col-span-full"
						>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Ohh!</AlertTitle>
							<AlertDescription>
								It seems like we did not find any listings given search
								parameters. <br /> Please change your filters. Thank you!
							</AlertDescription>
						</Alert>
					) : (
						<div
							className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 lg:grid-cols-${maxCols.toString()} w-full`}
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
