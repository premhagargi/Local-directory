'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves the total revenue from ads.
 *
 * @returns The total revenue in cents.
 */
export default async function getRevenueFromAds() {
	try {
		const supabase = createSupabaseRLSClient();
		const { data, error } = await supabase.from('ad_campaigns').select('price');

		if (error) {
			console.error('Error getting all ads (ADMIN PROTECTED)', error);
			throw new InternalServerError('Error retrieving ads. Contact Support.');
		}

		const totalRevenueInCents = data.reduce((acc, ad) => {
			return acc + (ad.price || 0);
		}, 0);

		return handleServerSuccess(totalRevenueInCents);
	} catch (error) {
		return handleServerError(error, 0);
	}
}
