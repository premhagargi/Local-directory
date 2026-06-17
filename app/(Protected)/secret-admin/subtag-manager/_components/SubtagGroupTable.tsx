'use client';
// Import Types
// Import External Packages
// Import Components
import SubtagGroupModal from './SubtagGroupModal';
import Pagination from '@/ui/Pagination';
import { Input } from '@/ui/Input';
import { Badge } from '@/ui/Badge';
// Import Functions & Actions & Hooks & State
import usePagination from '@/lib/usePagination';
import SubtagGroupDeleteModal from './SubtagGroupDeleteModal';
// Import Data
// Import Assets & Icons

export default function SubtagGroupTable({
	subtagGroups,
}: {
	subtagGroups:
		| {
				id: string;
				name: string;
		  }[]
		| null;
}) {
	const data = subtagGroups === null ? [] : subtagGroups;

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
							Subtag Group Name
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
									<SubtagGroupModal
										subtagGroup={group}
										buttonVariant="outline"
										buttonSize="sm"
									/>

									<SubtagGroupDeleteModal subtagGroupId={group.id} />
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
