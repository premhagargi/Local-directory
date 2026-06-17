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
 * Fetches the AI-generated description for a given subtag.
 * @param url - The subtag to generate the description for.
 * @returns The AI-generated description.
 */
export default async function getSubtagDescriptionWithAi(subtag: string) {
	const secretKey = process.env.API_SECRET_KEY;
	try {
		if (!subtag || subtag.length === 0 || subtag.length > 100) {
			throw new BadRequestError(
				'Invalid fields to handle Subtag Description with AI.'
			);
		}

		const response = await fetch(
			`${
				process.env.NODE_ENV === 'development'
					? 'http://localhost:3000'
					: COMPANY_BASIC_INFORMATION.URL
			}/api/ai/generate-subtag?secretKey=${secretKey}&subtag=${subtag}`
		);

		const responseObject: {
			error: string;
			description: string;
			headline: string;
		} = await response.json();

		if (responseObject.error) {
			console.error(
				'Error with API when handling subtag description with ai:',
				responseObject.error
			);
			throw new InternalServerError('Error getting subtag description with ai');
		}

		await insertActivity('new_ai_content', `${subtag}`);
		return handleServerSuccess({
			description: responseObject.description,
			headline: responseObject.headline,
		});
	} catch (error) {
		return handleServerError(error, { description: '', headline: '' });
	}
}
