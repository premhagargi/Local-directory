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

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates embeddings for a given title, description, and excerpt.
 * @param title - The title of the sublisting.
 * @param description - The description of the sublisting.
 * @param excerpt - The excerpt of the sublisting.
 * @param tokenLimiter - Whether to limit the number of tokens in the sublisting descriptor.
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
		let sublistingDescriptor = cleanMDXContent(
			`${title} ${description} ${excerpt}`
		);
		if (tokenLimiter) {
			sublistingDescriptor = sublistingDescriptor.slice(0, 100);
		}
		const aiResponse = await openai.embeddings.create({
			input: sublistingDescriptor,
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
