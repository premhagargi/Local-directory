'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import insertActivity from '@/actions/activites/insertActivity';
import { isValidUrl } from '@/lib/utils';
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
 * Fetches the AI-generated description for a given URL.
 * @param url - The URL to generate the description for.
 * @returns The AI-generated description.
 */
export default async function generateSublistingDescriptionWithAi(url: string) {
	const secretKey = process.env.API_SECRET_KEY;

	try {
		if (!isValidUrl(url)) {
			throw new BadRequestError('Invalid URL.');
		}

		const aiResponse = await fetch(
			`${
				process.env.NODE_ENV === 'development'
					? 'http://localhost:3000'
					: COMPANY_BASIC_INFORMATION.URL
			}/api/ai/generate-sublisting?secretKey=${secretKey}&url=${url}`
		);

		const data: {
			error: string;
			description: any;
			excerpt: any;
		} = await aiResponse.json();

		if (data.error) {
			console.error('Error getting ai description:', data.error);
			throw new InternalServerError('Error with AI! Contact Support.');
		}

		await insertActivity('new_ai_content', `${url}`);

		return handleServerSuccess({
			excerpt: data.excerpt,
			description: data.description,
		});
	} catch (error) {
		return handleServerError(error, { excerpt: '', description: '' });
	}
}
