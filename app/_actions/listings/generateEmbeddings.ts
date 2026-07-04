// Import Types
// Import External Packages
import OpenAI from 'openai';
// Import Components
// Import Functions & Actions & Hooks & State
import insertActivity from '@/actions/activites/insertActivity';
import { cleanMDXContent } from '@/lib/utils';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	BadRequestError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

// Lazily instantiate the OpenAI client so importing this module during the
// Next.js build (page-data collection) does not require OPENAI_API_KEY.
// The client is only constructed on first property access, at request time.
let openaiClient: OpenAI | null = null;
const openai = new Proxy({} as OpenAI, {
	get(_target, prop) {
		if (!openaiClient) {
			openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		}
		return openaiClient[prop as keyof OpenAI];
	},
});

/**
 * Generates embeddings for a given title, description, and excerpt.
 * @param title - The title of the listing.
 * @param description - The description of the listing.
 * @param excerpt - The excerpt of the listing.
 * @param tokenLimiter - Whether to limit the number of tokens in the listing descriptor.
 * @returns - A promise that resolves to the generated embedding.
 */
export default async function generateEmbeddings({
	title,
	description,
	excerpt,
	tokenLimiter,
}: {
	title: string;
	description: string;
	excerpt: string;
	tokenLimiter?: boolean;
}) {
	try {
		if (!title) {
			throw new BadRequestError('Invalid fields to handle feedback.');
		}
		if (!process.env.OPENAI_API_KEY) {
			console.warn('OPENAI_API_KEY is missing. Skipping embeddings generation.');
			// Return a dummy 1536-dimensional zero vector for pgvector
			return handleServerSuccess(new Array(1536).fill(0));
		}
		let listingDescriptor = cleanMDXContent(
			`${title} ${description} ${excerpt}`
		);
		if (tokenLimiter) {
			listingDescriptor = listingDescriptor.slice(0, 100);
		}
		const aiResponse = await openai.embeddings.create({
			input: listingDescriptor,
			model: 'text-embedding-3-small',
		});

		if (aiResponse) {
			await insertActivity(
				'new_ai_content',
				`New Embedding: ${title}. Token Usage: ${aiResponse.usage.total_tokens}`
			);
		}
		return handleServerSuccess(aiResponse.data[0].embedding);
	} catch (error) {
		return handleServerError(error, []);
	}
}
