'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
import {
	BadRequestError,
	UnauthorizedError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Handles the admin override for promotions.
 *
 * @param promotionId - The ID of the promotion.
 * @param newApproval - The new approval status for the promotion.
 * @param listingId - The ID of the listing.
 * @returns - A promise that resolves when the admin override is handled successfully.
 */
export default async function handlePromotions_ADMIN({
	promotionId,
	newApproval,
	listingId,
}: {
	promotionId: string;
	newApproval: boolean;
	listingId: string;
}) {
	try {
		if (!promotionId || newApproval === undefined || !listingId) {
			throw new BadRequestError(
				'Invalid fields to handle override promotions.'
			);
		}
		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error.');
		}

		const supabase = createSupabaseRLSClient();

		const { data: promotionData, error: promotionError } = await supabase
			.from('promotions')
			.update({ is_admin_approved: newApproval })
			.match({ id: promotionId })
			.select('*')
			.maybeSingle();

		if (promotionError) {
			console.error('Error updating promotion table: ', promotionError);
			throw new InternalServerError('Error updating promotion table');
		}

		const today = new Date();

		// We can only approve the promotion in the promotion table. The CRON JOB will pick this up and update the listing table, accordingly. However, we are able to (1) update the listing table, if the promotion should be activated immediately or (2) to disapprove the listing.

		if (
			promotionData &&
			newApproval &&
			new Date(promotionData.start_date) <= today &&
			new Date(promotionData.end_date) >= today
		) {
			const { error: listingError } = await supabase
				.from('listings')
				.update({ is_promoted: newApproval })
				.match({ id: listingId });

			if (listingError) {
				console.error('Error approving listing: ', promotionError);
				throw new InternalServerError('Error approving listing.');
			}
		} else if (!newApproval) {
			const { error: listingError } = await supabase
				.from('listings')
				.update({ is_promoted: newApproval })
				.match({ id: listingId });

			if (listingError) {
				console.error('Error disapproving listing: ', promotionError);
				throw new InternalServerError('Error disapproving listing.');
			}
		}

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
