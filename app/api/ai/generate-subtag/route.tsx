// Import Types
// Import External Packages
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
import {
	COMPANY_BASIC_INFORMATION,
	COMPANY_MARKETING_INFORMATION,
	SUBLISTINGS_SETTINGS,
} from '@/constants';
// Import Assets & Icons

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Secure Password Like Secret key
const secretKey = process.env.API_SECRET_KEY;

/**
 * Handles the GET request to generate DESCRIPTION & EXCERPT FOR A TAG.
 * @param req - The Request object representing the incoming request.
 * @returns A JSON response indicating the description and excerpt of the company.
 */
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const sharedKey = searchParams.get('secretKey');
	const subtag = searchParams.get('subtag');

	if (sharedKey !== secretKey) {
		return NextResponse.json(
			{ error: 'Invalid Secret Key', description: '', excerpt: '' },
			{ status: 400 }
		);
	}

	if (
		!subtag ||
		(subtag && subtag.length === 0) ||
		(subtag && subtag.length > 100)
	) {
		return NextResponse.json(
			{
				error: 'Missing or wrongly formatted subtag',
				description: '',
				excerpt: '',
			},
			{ status: 400 }
		);
	}

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are a research assistant for ${COMPANY_BASIC_INFORMATION.NAME}, which can be described as ${COMPANY_MARKETING_INFORMATION.META_DESCRIPTION}. The company uses tags and categories to cluster their listings. ${SUBLISTINGS_SETTINGS} You are tasked with analyzing and optimize for SEO the tag: ${subtag}. Generate a summary in JSON format with two fields in english: 1)'headline': A SEO-optimzed title for the tag (40-55 characters). 2) 'description': A SEO-optimized description for the tag (12-160 characters). This may not be empty! Remember that the company uses the tag to cluster their listings, so the headline and the description should fit their company purpose and the type of listing. If you have no knowledge of the provided input return 'Sorry, never heard.' for both values.`,
				},
				{
					role: 'user',
					content: `${subtag}`,
				},
			],
			temperature: 1,
			max_tokens: 512,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			response_format: { type: 'json_object' },
		});

		const jsonAnswer = response.choices[0].message.content;

		if (!jsonAnswer || jsonAnswer.includes('error')) {
			return NextResponse.json(
				{
					error: 'Error in AI response - subtag',
					description: '',
					headline: '',
				},
				{ status: 400 }
			);
		}

		const { description, headline } = JSON.parse(jsonAnswer);

		return NextResponse.json(
			{ error: '', description: description, headline: headline },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Error in Try Catch', description: '', headline: '' },
			{
				status: 400,
			}
		);
	}
}
