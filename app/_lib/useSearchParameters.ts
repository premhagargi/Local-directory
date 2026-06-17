'use client';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// Import Data
// Import Assets & Icons

/**
 * Custom hook for managing search parameters.
 * @returns An object containing the search parameters and a function to update them.
 */
export default function useSearchParameters() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const Router = useRouter();

	const createQueryString = (name: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(name, value);

		if (name !== 'page') {
			params.set('page', '1');
		}

		return params.toString();
	};

	const updateSearchParam = (name: string, value: string) =>
		Router.push(pathname + '?' + createQueryString(name, value), {
			scroll: false,
		});

	return {
		searchParams,
		updateSearchParam,
	};
}
