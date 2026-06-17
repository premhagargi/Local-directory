'use server';
// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { isValidUUID } from '@/utils';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

type DataType = {
	total_listings: number;
	total_likes: number;
	total_views: number;
	total_clicks: number;
	total_ratings: number;
	total_promotions: number;
	total_claims: number;
};

/**
 * Retrieves the statistics for a listing.
 *
 * @param finderId - The ID of the finder. Defaults to null.
 * @returns A promise that resolves to the listing statistics.
 */
export default async function getListingStats(finderId: string | null = null) {
	try {
		const supabase = createSupabaseRLSClient();
		const rpcParams =
			finderId && isValidUUID(finderId) ? { logged_user_id: finderId } : {};
		const { data, error } = await supabase.rpc(
			'get_listing_statistics',
			rpcParams
		);

		if (error) {
			console.error('Error fetching listing statistics - rpc-error:', error);
			throw new InternalServerError('Error fetching listing statistics');
		}

		const { data: adminData, error: adminError } = await supabase
			.from('listings')
			.select('id')
			.match({
				is_admin_published: false,
				is_user_published: true,
				...(finderId && isValidUUID(finderId) ? { owner_id: finderId } : {}),
			});

		if (adminError) {
			console.error('Error fetching listing statistics - admin-error:', error);
			throw new InternalServerError('Error fetching listing statistics');
		}

		const connectedData = {
			...(data as DataType),
			total_admin_approval_needed: adminData?.length,
		};

		return handleServerSuccess(connectedData);
	} catch (error) {
		return handleServerError(error, {
			total_admin_approval_needed: 0,
			total_listings: 0,
			total_likes: 0,
			total_views: 0,
			total_clicks: 0,
			total_ratings: 0,
			total_promotions: 0,
			total_claims: 0,
		});
	}
}
