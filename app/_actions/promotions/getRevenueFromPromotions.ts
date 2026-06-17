'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Retrieves the total revenue from promotions.
 *
 * @returns The total revenue in cents.
 */
export default async function getRevenueFromPromotions() {
	try {
		const supabase = createSupabaseRLSClient();

		const { data, error } = await supabase.from('promotions').select('price');
		if (!data || error) {
			console.error('Error handling feedback:', error);
			throw new InternalServerError('Error storing feedback');
		}

		const totalRevenueInCents = data.reduce((acc, ad) => {
			return acc + (ad.price || 0);
		}, 0);

		return handleServerSuccess(totalRevenueInCents);
	} catch (error) {
		console.error(error);
		return handleServerError(error, 0);
	}
}
