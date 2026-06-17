'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import generateEmbeddings from '@/actions/listings/generateEmbeddings';
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
 * @param searchTerm - The search term to match against listing titles.
 * @param tagArray - An array of tags to filter the listings by.
 * @param categoryFilter - The category to filter the listings by.
 * @returns An array of published listings that match the specified filters.
 */
export default async function getPublishedListingsByAi(
	limit?: number,
	searchTerm?: string | null,
	tagArray?: string[] | null,
	categoryFilter?: string | null
) {
	try {
		if (!searchTerm) {
			return handleServerSuccess([]);
		}

		let results;

		const supabase = createSupabaseBrowserClient();

		const { data: embedding, error: embeddingError } = await generateEmbeddings(
			{
				title: searchTerm,
				description: '',
				excerpt: '',
				tokenLimiter: true,
			}
		);

		if (embeddingError) {
			console.error('Error generating embeddings:', embeddingError);
			throw new InternalServerError(
				'Error generating embeddings. Contact Support.'
			);
		}

		const { data: resultsAi, error: aiError } = await supabase.rpc(
			'match_listings',
			{
				embedding: JSON.stringify(embedding),
				match_threshold: 0.35,
				match_count: limit || 10,
			}
		);

		if (aiError) {
			console.error('Error RPC match_listings:', aiError);
			throw new InternalServerError(
				'Error retrieving listings. Contact Support.'
			);
		}

		const { data: listingData, error: listingError } = await supabase
			.from('listings')
			.select(listingParams)
			.match({
				is_user_published: true,
				is_admin_published: true,
			})
			.in(
				'id',
				resultsAi.map((listing) => listing.id)
			)
			.order('created_at', { ascending: false })
			.limit(limit || 200);

		if (listingError) {
			console.error('Error finding listings by AI ID:', aiError);
			throw new InternalServerError(
				'Error retrieving listings. Contact Support.'
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
