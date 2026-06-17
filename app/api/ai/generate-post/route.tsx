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
} from '@/constants';
// Import Assets & Icons

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Secure Password Like Secret key
const secretKey = process.env.API_SECRET_KEY;

/**
 * Handles the GET request to generate CONTENT for BLOG POST based on the URL.
 * @param req - The Request object representing the incoming request.
 * @returns A JSON response indicating the description and excerpt of the company.
 */
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const sharedKey = searchParams.get('secretKey');
	const title = searchParams.get('title');

	if (sharedKey !== secretKey) {
		return NextResponse.json(
			{ error: 'Invalid Secret Key', content: '' },
			{ status: 400 }
		);
	}

	if (!title || title.length === 0) {
		return NextResponse.json(
			{
				error: 'Missing or wrongly formatted URL',
				content: '',
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
					content: `You are a blog writer for ${COMPANY_BASIC_INFORMATION.NAME}, which can be described as ${COMPANY_MARKETING_INFORMATION.META_DESCRIPTION}. Your task is to write short and engaging blog articles for publication on ${COMPANY_BASIC_INFORMATION.NAME} based on a provided blog post title and targeted towards individuals interested in the mission of the company. Generate your text in english basic language and output in JSON format in the key called 'content, like {'content':string}. The blog post should be markdown-formatted, structured into at least two sections, no h1 tag, no links (250-350 words).`,
				},
				{
					role: 'user',
					content: `Title: ${title}`,
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
				{ error: 'Error in AI response', content: '' },
				{ status: 400 }
			);
		}

		const { content } = JSON.parse(jsonAnswer);

		return NextResponse.json(
			{ error: '', content: content },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Error in Try Catch', content: '' },
			{
				status: 400,
			}
		);
	}
}
