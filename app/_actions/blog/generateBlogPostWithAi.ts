'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import insertActivity from '@/actions/activites/insertActivity';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
// Import Error Handling
import {
	BadRequestError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Fetches the AI-generated content for a given title.
 * @param url - The URL to generate the description for.
 * @returns The AI-generated description.
 */
export default async function generateBlogPostWithAi(title: string) {
	const secretKey = process.env.API_SECRET_KEY;

	try {
		if (!title || title.length === 0 || title.length > 100) {
			throw new BadRequestError(
				'Invalid fields to handle Blog Generation with AI.'
			);
		}
		const response = await fetch(
			`${
				process.env.NODE_ENV === 'development'
					? 'http://localhost:3000'
					: COMPANY_BASIC_INFORMATION.URL
			}/api/ai/generate-post?secretKey=${secretKey}&title=${title}`
		);
		const responseObject: {
			error: string;
			content: any;
		} = await response.json();

		if (responseObject.error) {
			console.error(
				'Error with API when handling blog generation with ai:',
				responseObject.error
			);
			throw new InternalServerError(
				'Error handling blog generation with ai. Please contact support.'
			);
		}

		await insertActivity('new_ai_content', `${title}`);
		return handleServerSuccess({
			content: responseObject.content,
		});
	} catch (error) {
		return handleServerError(error, { content: '' });
	}
}
