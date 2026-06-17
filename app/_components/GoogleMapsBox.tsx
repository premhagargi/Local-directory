'use client';

// Import Types
// Import External Packages
// Import Components
import { CookieConsentButton_Accept } from '@/components/CookieConsentBanner';
// Import Functions & Actions & Hooks & State
import { useCookieConsent } from '@/state/useCookieConsent';
// Import Data
// Import Assets & Icons

import { GoogleMapsEmbed } from '@next/third-parties/google';

export default function GoogleMapsBox({
	locationQuery,
	height = 400,
	className,
}: {
	locationQuery: string;
	height?: number;
	className?: string;
}) {
	const { hasCookieConsent } = useCookieConsent();

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || undefined;
	return apiKey ? (
		hasCookieConsent === true ? (
			<div className={className}>
				<GoogleMapsEmbed
					apiKey={apiKey || ''}
					height={height}
					width="100%"
					mode="place"
					q={locationQuery}
					zoom="8"
					allowfullscreen={false}
				/>
			</div>
		) : (
			<CookieConsentButton_Accept
				buttonText="Accept Cookies to display map"
				variant="outline"
			/>
		)
	) : (
		<p>Google Maps not activated.</p>
	);
}
