// Import Types
// Import External Packages
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import OpenAI from 'openai';
import {
	SUBLISTINGS_SETTINGS,
	COMPANY_MARKETING_INFORMATION,
} from '@/constants';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Secure Password Like Secret key
const secretKey = process.env.API_SECRET_KEY;

const cleanText = (text: string): string => {
	return text.replace(/\s+/g, ' ').trim();
};

async function summarizeText(text: string) {
	const slicedText = text.slice(0, 2000);
	return await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: `You are a research assistant tasked with creating product listings for a directory business. The directory can be discribed as: ${COMPANY_MARKETING_INFORMATION.META_DESCRIPTION}. A listing can be described as: ${SUBLISTINGS_SETTINGS} You will be provided with unstructured text data related to these products. Your task is to generate a listing entry in JSON format with two fields in English: 1. 'excerpt': An SEO-optimized summary of the following description (100-160 characters). 2. 'description': A high-level markdown-formatted analysis, structured into two h2 sections (Product Details and Highlights), no h1 tag, no links (250-350 words). This description will serve as the body of a listing. Guidelines: - Focus on writing a positive and appealing listing entry.  - Extract and use relevant information from the text provided, maintaining a tone similar to the original text. - Do not mention unavailable features or technical details (e.g., JavaScript requirements) unless the content is completely unreadable.`,
			},
			{
				role: 'user',
				content: `${slicedText}`,
			},
		],
		temperature: 1,
		max_tokens: 512,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		response_format: { type: 'json_object' },
	});
}

const fetchContentFromUrl = async (url: string) => {
	const response = await fetch(url);
	const html = await response.text();

	const dom = new JSDOM(html, { url });
	const reader = new Readability(dom.window.document);
	const article = reader.parse();

	if (article && article.textContent) {
		return cleanText(article.textContent);
	}

	return null;
};

/**
 * Handles the GET request to generate DESCRIPTION & EXCERPRT FOR A LISTING based on the URL.
 * @param req - The Request object representing the incoming request.
 * @returns A JSON response indicating the description and excerpt of the company.
 */
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const sharedKey = searchParams.get('secretKey');
	const url = searchParams.get('url');

	if (sharedKey !== secretKey) {
		return NextResponse.json(
			{ error: 'Invalid Secret Key', description: '', excerpt: '' },
			{ status: 400 }
		);
	}

	if (
		!url ||
		url.length === 0 ||
		(!url.startsWith('http://') && !url.startsWith('https://'))
	) {
		return NextResponse.json(
			{
				error: 'Missing or wrongly formatted URL',
				description: '',
				excerpt: '',
			},
			{ status: 400 }
		);
	}

	try {
		const content = await fetchContentFromUrl(url);
		if (!content) {
			return NextResponse.json(
				{ error: 'Error in fetching content', description: '', excerpt: '' },
				{ status: 400 }
			);
		}

		const summary = await summarizeText(content);

		const jsonAnswer = summary.choices[0].message.content;

		if (!jsonAnswer || jsonAnswer.includes('error')) {
			return NextResponse.json(
				{ error: 'Error in AI response', description: '', excerpt: '' },
				{ status: 400 }
			);
		}

		const { description, excerpt } = JSON.parse(jsonAnswer);

		return NextResponse.json(
			{ error: '', description: description, excerpt: excerpt },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Error in Try Catch', description: '', excerpt: '' },
			{
				status: 400,
			}
		);
	}
}
