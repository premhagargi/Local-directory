// Import Types
// Import External Packages
// Import Components
import { Button } from '@/ui/Button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/ui/Select';
// Import Functions & Actions & Hooks & State
import { capitalize, cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	SkipForwardIcon,
	SkipBackIcon,
} from 'lucide-react';

export default function Pagination({
	itemsPerPage,
	totalItems,
	paginateFront,
	paginateBack,
	paginateFrontFF,
	paginateBackFF,
	currentPage,
	filteredItems,
	totalPages,
	setItemsPerPage,
	nameOfItems = 'items',
	pageSizeOptions = [1, 2, 5, 10, 25, 50, 100],
	className,
}: {
	itemsPerPage: number;
	totalItems: number;
	filteredItems?: number;
	paginateFront: () => void;
	paginateBack: () => void;
	paginateFrontFF: () => void;
	paginateBackFF: () => void;
	currentPage: number;
	totalPages: number;
	setItemsPerPage?: (arg0: number) => void;
	nameOfItems?: string;
	pageSizeOptions?: number[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid md:flex flex-wrap items-center w-full mt-6 justify-between space-y-4 md:space-y-0',
				className
			)}
		>
			<div className="flex flex-wrap sm:space-x-2 justify-center md:justify-start">
				{setItemsPerPage && (
					<div className="flex items-center space-x-2">
						<p className="text-sm text-muted-foreground">
							<span>{capitalize(nameOfItems)}</span> per page
						</p>
						<Select
							value={`${itemsPerPage}`}
							onValueChange={(value) => {
								setItemsPerPage(Number(value));
							}}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue placeholder={itemsPerPage} />
							</SelectTrigger>
							<SelectContent side="top">
								{pageSizeOptions.map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
				<div className="flex items-center text-sm text-muted-foreground space-x-1">
					<span>Showing</span>
					<span>
						<span className="font-bold">
							{(!filteredItems && totalItems > 0) ||
							(filteredItems && filteredItems > 0)
								? currentPage * itemsPerPage - itemsPerPage + 1
								: '0'}
						</span>
						<span> {'-'} </span>
						<span className="font-bold">
							{currentPage * itemsPerPage > (filteredItems ?? totalItems)
								? filteredItems ?? totalItems
								: currentPage * itemsPerPage}
						</span>
					</span>
					<span>of</span>
					{filteredItems && filteredItems !== totalItems ? (
						<>
							<span className="font-bold"> {filteredItems} </span>
							<span>filtered {nameOfItems} out of a total of</span>
						</>
					) : (
						<></>
					)}
					<span className="font-bold">{totalItems}</span>
					<span>{nameOfItems}</span>
				</div>
			</div>
			<div className="flex items-center justify-center" aria-label="Pagination">
				<div className="mx-auto flex items-center space-x-2">
					<Button
						onClick={() => {
							paginateBackFF();
						}}
						variant="outline"
						className="  h-8 w-8 p-0 lg:flex"
						disabled={currentPage === 1}
					>
						<span className="sr-only">Go to first page</span>
						<SkipBackIcon />
					</Button>
					<Button
						onClick={() => {
							paginateBack();
						}}
						variant="outline"
						className="  h-8 w-8 p-0 lg:flex"
						disabled={currentPage === 1}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeftIcon />
					</Button>
					<div className="mx-auto flex w-[100px] items-center justify-center whitespace-nowrap text-sm text-muted-foreground">
						Page {currentPage} of {totalPages}
					</div>
					<Button
						onClick={() => {
							paginateFront();
						}}
						variant="outline"
						className="  h-8 w-8 p-0 lg:flex"
						disabled={currentPage === totalPages}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRightIcon />
					</Button>
					<Button
						onClick={() => {
							paginateFrontFF();
						}}
						variant="outline"
						className="  h-8 w-8 p-0 lg:flex"
						disabled={currentPage === totalPages}
					>
						<span className="sr-only">Go to last page</span>
						<SkipForwardIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}
