// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
import {
	COMPANY_BASIC_INFORMATION,
	COMPANY_MARKETING_INFORMATION,
} from '@/constants';
// Import Assets & Icons

type MetaDataImage = {
	url: string;
	type: string;
	alt: string;
	width: number;
	height: number;
};

/**
 * Creates metadata for a web page. If not customs are provided, it will use the default values provided in /constants.ts.
 * @param customTitle - The custom title for the page.
 * @param customDescription - The custom description for the page.
 * @param customTags - The custom tags for the page.
 * @param customImages - The custom images for the page.
 * @returns The metadata object.
 */
export default function createMetaData({
	customTitle,
	customDescription,
	customTags,
	customImages,
	customSlug,
}: {
	customTitle?: string;
	customDescription?: string;
	customTags?: string[];
	customImages?: MetaDataImage[];
	customSlug?: string;
}): Metadata {
	return {
		title: {
			default:
				customTitle ??
				COMPANY_MARKETING_INFORMATION.META_TITLE ??
				'Missing Title',
			template: `%s | ${COMPANY_BASIC_INFORMATION.NAME}`,
		},
		description:
			customDescription ??
			COMPANY_MARKETING_INFORMATION.META_DESCRIPTION ??
			'Missing Description',
		metadataBase: new URL(COMPANY_BASIC_INFORMATION.URL) ?? 'Missing URL',
		keywords: customTags ??
			COMPANY_MARKETING_INFORMATION.META_KEYWORDS ?? ['Missing Tags'],

		openGraph: {
			url: customSlug
				? COMPANY_BASIC_INFORMATION.URL + '/' + customSlug
				: COMPANY_BASIC_INFORMATION.URL ?? 'Missing URL',
			emails:
				COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL ?? 'Missing SUPPORT EMAIL',
			siteName: COMPANY_BASIC_INFORMATION.NAME ?? 'Missing Company Name',
			title:
				customTitle ??
				COMPANY_MARKETING_INFORMATION.META_TITLE ??
				'Missing Title',
			description:
				customDescription ??
				COMPANY_MARKETING_INFORMATION.META_DESCRIPTION ??
				'Missing Description',
			type: 'website',
			locale: 'en_US',
			images: customImages ?? [
				{
					url: `${COMPANY_BASIC_INFORMATION.URL}/img/og_1200x630.png`,
					type: 'image',
					alt: `${COMPANY_BASIC_INFORMATION.NAME} OG Image 1200x630`,
					width: 1200,
					height: 630,
				},
				{
					url: `${COMPANY_BASIC_INFORMATION.URL}/img/og_1080x1080.png`,
					type: 'image',
					alt: `${COMPANY_BASIC_INFORMATION.NAME} OG Image 1080x1080`,
					width: 1080,
					height: 1080,
				},
				{
					url: `${COMPANY_BASIC_INFORMATION.URL}/img/og_1600x900.png`,
					type: 'image',
					alt: `${COMPANY_BASIC_INFORMATION.NAME} OG Image 1600x900`,
					width: 1600,
					height: 900,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			creator: COMPANY_MARKETING_INFORMATION.SOCIAL_LINKS[0].USERNAME ?? '',
			description:
				customDescription ??
				COMPANY_MARKETING_INFORMATION.META_DESCRIPTION ??
				'Missing Description',
			title:
				customTitle ??
				COMPANY_MARKETING_INFORMATION.META_TITLE ??
				'Missing Title',
			images:
				customImages?.[0]?.url ??
				`${COMPANY_BASIC_INFORMATION.URL}/img/og_1600x900.png`,
		},
	};
}
