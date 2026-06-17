'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import insertActivity from '@/actions/activites/insertActivity';
import { sublistingsParams } from '@/lib/supabaseQueries';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves published sublistings from the database based on the specified filters.
 * @param limit - The maximum number of sublistings to retrieve.
 * @param skipId - The ID of the sublisting to skip.
 * @param searchTerm - The search term to match against sublisting titles.
 * @param subtagArray - An array of subtags to filter the sublistings by.
 * @param subcategoryFilter - The subcategory to filter the sublistings by.
 * @returns An array of published sublistings that match the specified filters.
 */
export default async function getPublishedSublistings(
	limit?: number,
	skipId?: string | null,
	searchTerm?: string | null,
	subtagArray?: string[] | null,
	subcategoryFilter?: string | null,
	sortByKey?: string | null,
	sortByOrder?: boolean | null,
	includeOutOfStock?: boolean | null,
	minPriceFilter?: string | null,
	maxPriceFilter?: string | null,
	categoryFilter?: string | null,
	listingFilter?: string | null
) {
	try {
		let results;
		const supabase = createSupabaseBrowserClient();

		let query = supabase.from('sublistings').select(sublistingsParams).match({
			is_user_published: true,
			is_admin_published: true,
		});

		// For Category Search in DB - instead of here in the file - add to match():  , ...(subcategoryFilter ? { 'subcategory.slug': subcategoryFilter } : {})

		if (searchTerm) {
			query = query.textSearch('fts', searchTerm.replace(/\s+/g, '+'));
			await insertActivity('new_search', searchTerm);
		}

		if (skipId) query = query.not('id', 'eq', skipId);

		if (!!includeOutOfStock) {
		} else {
			query = query.match({ availability: true });
		}

		query
			.order(sortByKey || 'created_at', { ascending: sortByOrder || false })
			.limit(limit || 200);

		const { data: sublistingData, error } = await query;

		if (error) {
			console.error('Error getting published sublistings:', error);
			throw new InternalServerError(
				'Error getting published sublistings. Contact Support.'
			);
		}

		const matchesTags = (
			sublisting: (typeof sublistingData)[0],
			subtags: typeof subtagArray
		) => {
			if (!subtags) return true;
			const sublistingTags = sublisting.subtags.map((subtag) => subtag.slug);
			return subtags.every((subtag) => sublistingTags.includes(subtag));
		};

		const matchesSubcategory = (
			sublisting: (typeof sublistingData)[0],
			subcategory: typeof subcategoryFilter
		) => {
			return sublisting.subcategory.slug === subcategory;
		};

		const matchesPrice = (
			sublisting: (typeof sublistingData)[0],
			minPrice: string,
			maxPrice: string
		) => {
			const price =
				Number(sublisting.price_promotional_in_cents) > 0
					? Number(sublisting.price_promotional_in_cents)
					: Number(sublisting.price_regular_in_cents);
			if (price >= Number(minPrice) * 100 && price <= Number(maxPrice) * 100) {
				return true;
			}
			return false;
		};

		const matchesCategory = (
			sublisting: (typeof sublistingData)[0],
			category: typeof categoryFilter
		) => {
			/*
     			 // @ts-ignore */
			return sublisting.owner.category_id === category;
		};

		const matchesListing = (
			sublisting: (typeof sublistingData)[0],
			listing: typeof listingFilter
		) => {
			/*
	 			 // @ts-ignore */
			return sublisting.owner.id === listing;
		};

		results = sublistingData.filter((sublisting) => {
			const subtagCondition =
				subtagArray && subtagArray.length > 0
					? matchesTags(sublisting, subtagArray)
					: true;
			const subcategoryCondition = subcategoryFilter
				? matchesSubcategory(sublisting, subcategoryFilter)
				: true;
			const priceCondition =
				minPriceFilter && maxPriceFilter
					? matchesPrice(sublisting, minPriceFilter, maxPriceFilter)
					: true;
			const categoryCondition = categoryFilter
				? matchesCategory(sublisting, categoryFilter)
				: true;

			const listingCondition = listingFilter
				? matchesListing(sublisting, listingFilter)
				: true;
			return (
				subtagCondition &&
				subcategoryCondition &&
				priceCondition &&
				categoryCondition &&
				listingCondition
			);
		});

		return handleServerSuccess(results);
	} catch (error) {
		return handleServerError(error, []);
	}
}
