import { MetadataRoute } from 'next';
import {
	COMPANY_BASIC_INFORMATION,
	COMPANY_MARKETING_INFORMATION,
} from '@/constants';

// https://medium.com/@davegray_86804/next-js-favicon-svg-icon-apple-chrome-icons-2e3c686ede79

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: COMPANY_BASIC_INFORMATION.NAME,
		short_name: COMPANY_BASIC_INFORMATION.NAME,
		description: COMPANY_MARKETING_INFORMATION.META_DESCRIPTION,
		start_url: '/',
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#fff',
		icons: [
			{
				src: '/icons/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
