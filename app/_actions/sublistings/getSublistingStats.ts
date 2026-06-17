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
	total_sublistings: number;
	total_likes: number;
	total_views: number;
	total_clicks: number;
	total_ratings: number;
	total_promotions: number;
	total_claims: number;
};

/**
 * Retrieves the statistics for a sublisting.
 *
 * @param finderId - The ID of the finder. Defaults to null.
 * @param listingId - The ID of the listing. Defaults to null.
 * @returns A promise that resolves to the sublisting statistics.
 */
export default async function getSublistingStats(
	finderId: string | null = null,
	sublistingId: string | null = null
) {
	try {
		const supabase = createSupabaseRLSClient();
		const rpcParams = {
			logged_user_id: finderId && isValidUUID(finderId) ? finderId : undefined,
			sublisting_id:
				sublistingId && isValidUUID(sublistingId) ? sublistingId : undefined,
		};
		const { data, error } = await supabase.rpc(
			'get_sublisting_statistics',
			rpcParams
		);

		if (error) {
			console.error('Error fetching sublisting statistics - rpc-error:', error);
			throw new InternalServerError('Error fetching sublisting statistics');
		}

		const { data: adminData, error: adminError } = await supabase
			.from('sublistings')
			.select('id')
			.match({
				is_admin_published: false,
				is_user_published: true,
				...(sublistingId && isValidUUID(sublistingId)
					? { listing_id: sublistingId }
					: {}),
			});

		if (adminError) {
			console.error(
				'Error fetching sublisting statistics - admin-error:',
				error
			);
			throw new InternalServerError('Error fetching sublisting statistics');
		}

		const connectedData = {
			...(data as DataType),
			total_admin_approval_needed: adminData?.length,
		};

		return handleServerSuccess(connectedData);
	} catch (error) {
		return handleServerError(error, {
			total_admin_approval_needed: 0,
			total_sublistings: 0,
			total_likes: 0,
			total_views: 0,
			total_clicks: 0,
			total_ratings: 0,
			total_promotions: 0,
			total_claims: 0,
		});
	}
}
