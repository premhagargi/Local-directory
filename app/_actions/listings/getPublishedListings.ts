'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import insertActivity from '@/actions/activites/insertActivity';
import { listingParams } from '@/lib/supabaseQueries';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves published listings from the database based on the specified filters.
 * @param limit - The maximum number of listings to retrieve.
 * @param skipId - The ID of the listing to skip.
 * @param searchTerm - The search term to match against listing titles.
 * @param tagArray - An array of tags to filter the listings by.
 * @param categoryFilter - The category to filter the listings by.
 * @returns An array of published listings that match the specified filters.
 */
export default async function getPublishedListings(
	limit?: number,
	skipId?: string | null,
	searchTerm?: string | null,
	tagArray?: string[] | null,
	categoryFilter?: string | null,
	sortByKey?: string | null,
	sortByOrder?: boolean | null
) {
	try {
		let results;
		const supabase = createSupabaseBrowserClient();

		let query = supabase.from('listings').select(listingParams).match({
			is_user_published: true,
			is_admin_published: true,
		});

		// For Category Search in DB - instead of here in the file - add to match():  , ...(categoryFilter ? { 'category.slug': categoryFilter } : {})

		if (searchTerm) {
			query = query.textSearch('fts', searchTerm.replace(/\s+/g, '+'));
			await insertActivity('new_search', searchTerm);
		}

		if (skipId) query = query.not('id', 'eq', skipId);

		query
			.order(sortByKey || 'created_at', { ascending: sortByOrder || false })
			.limit(limit || 200);

		const { data: listingData, error } = await query;

		if (error) {
			console.error('Error getting published listings:', error);
			throw new InternalServerError(
				'Error getting published listings. Contact Support.'
			);
		}

		const matchesTags = (
			listing: (typeof listingData)[0],
			tags: typeof tagArray
		) => {
			if (!tags) return true;
			const listingTags = listing.tags.map((tag) => tag.slug);
			return tags.every((tag) => listingTags.includes(tag));
		};

		const matchesCategory = (
			listing: (typeof listingData)[0],
			category: typeof categoryFilter
		) => {
			return listing.category.slug === category;
		};

		results = listingData.filter((listing) => {
			const tagCondition =
				tagArray && tagArray.length > 0 ? matchesTags(listing, tagArray) : true;
			const categoryCondition = categoryFilter
				? matchesCategory(listing, categoryFilter)
				: true;
			return tagCondition && categoryCondition;
		});

		return handleServerSuccess(results);
	} catch (error) {
		return handleServerError(error, []);
	}
}
