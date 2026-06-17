'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import generateEmbeddings from '@/actions/sublistings/generateEmbeddings';
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
 * @param searchTerm - The search term to match against sublisting titles.
 * @param subtagArray - An array of tags to filter the sublistings by.
 * @param categoryFilter - The category to filter the sublistings by.
 * @returns An array of published sublistings that match the specified filters.
 */
export default async function getPublishedSublistingsByAi(
	limit?: number,
	searchTerm?: string | null,
	subtagArray?: string[] | null,
	subcategoryFilter?: string | null
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
			'match_sublistings',
			{
				embedding: JSON.stringify(embedding),
				match_threshold: 0.35,
				match_count: limit || 10,
			}
		);

		if (aiError) {
			console.error('Error RPC match_sublistings:', aiError);
			throw new InternalServerError(
				'Error retrieving sublistings. Contact Support.'
			);
		}

		const { data: sublistingData, error: sublistingError } = await supabase
			.from('sublistings')
			.select(sublistingsParams)
			.match({
				is_user_published: true,
				is_admin_published: true,
			})
			.in(
				'id',
				resultsAi.map((sublisting) => sublisting.id)
			)
			.order('created_at', { ascending: false })
			.limit(limit || 200);

		if (sublistingError) {
			console.error('Error finding sublistings by AI ID:', aiError);
			throw new InternalServerError(
				'Error retrieving sublistings. Contact Support.'
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

		const matchesCategory = (
			sublisting: (typeof sublistingData)[0],
			category: typeof subcategoryFilter
		) => {
			return sublisting.subcategory.slug === category;
		};

		results = sublistingData.filter((sublisting) => {
			const tagCondition =
				subtagArray && subtagArray.length > 0
					? matchesTags(sublisting, subtagArray)
					: true;
			const categoryCondition = subcategoryFilter
				? matchesCategory(sublisting, subcategoryFilter)
				: true;
			return tagCondition && categoryCondition;
		});

		return handleServerSuccess(results);
	} catch (error) {
		return handleServerError(error, []);
	}
}
