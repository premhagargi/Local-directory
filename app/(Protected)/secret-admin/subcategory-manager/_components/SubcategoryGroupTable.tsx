'use client';
// Import Types
// Import External Packages
// Import Components
import SubcategoryGroupModal from './SubcategoryGroupModal';
import Pagination from '@/ui/Pagination';
import { Input } from '@/ui/Input';
import { Badge } from '@/ui/Badge';
// Import Functions & Actions & Hooks & State
import usePagination from '@/lib/usePagination';
import SubcategoryGroupDeleteModal from './SubcategoryGroupDeleteModal';
// Import Data
// Import Assets & Icons

export default function SubcategoryGroupTable({
	subcategoryGroups,
}: {
	subcategoryGroups:
		| {
				id: string;
				name: string;
		  }[]
		| null;
}) {
	const data = subcategoryGroups === null ? [] : subcategoryGroups;

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
		data: data,
		searchField: 'name',
	});

	return (
		<>
			<div className="w-full flex justify-end">
				<Input
					className="w-58"
					placeholder="Search by name..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>
			<div className="table table-auto w-full mt-6">
				<div className="table-header-group">
					<div className="table-row text-sm">
						<div className="table-cell h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2 border-neutral-200">
							Subcategory Group Name
						</div>

						<div className="table-cell w-24 h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
							Edit / Delete
						</div>
					</div>
				</div>
				<div className="table-row-group">
					{currentData.map((group) => (
						<div key={group.id} className="table-row h-auto">
							<div className="table-cell content-center font-medium p-2 align-middle border-b-2 border-neutral-200">
								<Badge variant="default" className="whitespace-nowrap">
									{group.name}
								</Badge>
							</div>

							<div className="table-cell content-center p-2  border-b-2 border-neutral-200">
								<div className="flex gap-2">
									<SubcategoryGroupModal
										subcategoryGroup={group}
										buttonVariant="outline"
										buttonSize="sm"
									/>

									<SubcategoryGroupDeleteModal subcategoryGroupId={group.id} />
								</div>
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
		</>
	);
}
