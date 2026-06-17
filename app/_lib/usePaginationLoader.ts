'use client';

// Import Types
// Import External Packages
import { useState } from 'react';
// Import Components
// Import Functions & Actions & Hooks & State
import useSearchParameters from '@/lib/useSearchParameters';
// Import Data
// Import Assets & Icons

type PaginationProps<T> = {
	initialItemsPerPage?: number;
	totalSizeOfDataSet: number;
};

/**
 * Custom hook for managing pagination - BEST USED WITH TO BE LOADED DATA.
 * @returns An object containing the current data, current page, total pages, items per page, and functions to paginate.
 */
export default function usePaginationLoader<T>({
	totalSizeOfDataSet,
}: PaginationProps<T>) {
	const { searchParams, updateSearchParam } = useSearchParameters();
	const [itemsPerPage, setItemsPerPage] = useState(
		parseInt(searchParams.get('ipp') || '10') || 10
	);
	const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
	const [currentPage, setCurrentPage] = useState(
		parseInt(searchParams.get('page') || '1') || 1
	);

	const maxItemsPerPage = 100;

	const totalPages = Math.min(
		Math.ceil(totalSizeOfDataSet / itemsPerPage),
		maxItemsPerPage
	);

	const paginateFront = () => {
		updateSearchParam('page', `${Math.min(currentPage + 1, totalPages)}`);
		setCurrentPage(Math.min(currentPage + 1, totalPages));
	};
	const paginateBack = () => {
		updateSearchParam('page', `${Math.max(currentPage - 1, 1)}`);
		setCurrentPage(Math.max(currentPage - 1, totalPages));
	};
	const paginateFrontFF = () => {
		updateSearchParam('page', `${totalPages}`);
		setCurrentPage(totalPages);
	};
	const paginateBackFF = () => {
		updateSearchParam('page', '1');
		setCurrentPage(1);
	};

	const changeItemsPerPage = (arg0: number) => {
		updateSearchParam('ipp', arg0.toString());
		setItemsPerPage(arg0);
		setCurrentPage(1);
	};

	const changeTypeFilter = (arg0: string) => {
		setTypeFilter(arg0);
		setCurrentPage(1);
		updateSearchParam('type', arg0);
	};

	return {
		currentPage,
		totalPages,
		itemsPerPage,
		paginateFront,
		paginateBack,
		paginateFrontFF,
		paginateBackFF,
		changeItemsPerPage,
		changeTypeFilter,
		typeFilter,
	};
}
