'use client';

// Import Types
// Import External Packages
import { useState } from 'react';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

type PaginationProps<T> = {
	initialPage?: number;
	initialItemsPerPage?: number;
	data: T[];
	searchField?: keyof T;
};

/**
 * Custom hook for managing pagination - BEST USED WITH DOWNLOADED DATA.
 * @returns An object containing the current data, current page, total pages, items per page, and functions to paginate.
 */
export default function usePagination<T>({
	initialPage = 1,
	initialItemsPerPage = 10,
	data,
	searchField,
}: PaginationProps<T>) {
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
	const [searchTerm, setSearchTerm] = useState('');

	const totalPages = Math.ceil(data.length / itemsPerPage);

	let prefilteredData = data;

	if (searchField && searchTerm && searchTerm !== '') {
		prefilteredData = data.filter((item) =>
			(item[searchField] as string)
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		);
	}

	const currentData = prefilteredData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const paginateFront = () =>
		setCurrentPage((current) => Math.min(current + 1, totalPages));
	const paginateBack = () =>
		setCurrentPage((current) => Math.max(current - 1, 1));
	const paginateFrontFF = () => setCurrentPage(totalPages);
	const paginateBackFF = () => setCurrentPage(1);

	return {
		currentData,
		currentPage,
		totalPages,
		itemsPerPage,
		paginateFront,
		paginateBack,
		paginateFrontFF,
		paginateBackFF,
		setItemsPerPage,
		setSearchTerm,
	};
}
