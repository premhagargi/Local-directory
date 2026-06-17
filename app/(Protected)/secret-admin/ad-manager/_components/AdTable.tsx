'use client';
// Import Types
import { Tables } from '@/supabase-types';
// Import External Packages
import { useRouter } from 'next/navigation';
// Import Components
import Pagination from '@/ui/Pagination';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Badge } from '@/ui/Badge';
// Import Functions & Actions & Hooks & State
import usePagination from '@/lib/usePagination';
// Import Data
// Import Assets & Icons

/**
 * A table component that displays listings.
 * @param listings - The listings to display.
 */
export default function AdTable({
	ads,
}: {
	ads: Tables<'ad_campaigns'>[] | null;
}) {
	const data = ads === null ? [] : ads;
	const router = useRouter();

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
		initialItemsPerPage: 10,
		data: data,
		searchField: 'name',
	});

	const today = new Date();

	return (
		<div>
			<div className="w-full flex justify-end">
				<Input
					className="w-58"
					placeholder="Search by name..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>

			<div className="grid">
				<div className="table table-auto w-full mt-6">
					<div className="table-header-group">
						<div className="table-row text-sm">
							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Campaign Name
							</div>

							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Is Active
							</div>
							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Slot
							</div>
							<div className="table-cell w-24 h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Edit
							</div>
						</div>
					</div>
					<div className="table-row-group">
						{currentData.map((ad) => (
							<div key={ad.id} className="table-row h-auto">
								<div className="hidden sm:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
									{ad.name}
								</div>

								<div className="table-cell content-center font-medium p-2 align-middle border-b-2 border-neutral-200">
									<Badge variant="default" className="whitespace-nowrap">
										{new Date(ad.start_date) <= today &&
										new Date(ad.end_date) >= today
											? 'Active'
											: 'Inactive'}
									</Badge>
								</div>
								<div className="table-cell content-center font-medium p-2 align-middle border-b-2 border-neutral-200">
									{ad.slot_name}
								</div>

								<div className="table-cell content-center p-2 border-b-2 border-neutral-200">
									<Button
										variant="outline"
										onClick={() => {
											router.push(`/secret-admin/ad-manager/${ad.id}`);
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

				<Pagination
					itemsPerPage={itemsPerPage}
					totalItems={data.length}
					paginateBack={paginateBack}
					paginateFront={paginateFront}
					paginateBackFF={paginateBackFF}
					paginateFrontFF={paginateFrontFF}
					currentPage={currentPage}
					totalPages={totalPages}
					setItemsPerPage={setItemsPerPage}
					pageSizeOptions={[5, 10, 25, 50]}
					nameOfItems="items"
				/>
			</div>
		</div>
	);
}
