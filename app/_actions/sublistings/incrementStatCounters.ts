'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State#
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { isValidUUID } from '@/utils';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	BadRequestError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Increments the stat counters for a listing.
 *
 * @param sublistingId - The ID of the listing.
 * @param fieldName - The name of the field to increment ('clicks', 'views', or 'likes').
 * @returns A promise that resolves to the result of the operation.
 */
export default async function incrementStatCounters(
	sublistingId: string,
	fieldName: 'clicks' | 'views' | 'likes'
) {
	try {
		if (
			fieldName !== 'clicks' &&
			fieldName !== 'views' &&
			fieldName !== 'likes'
		) {
			throw new BadRequestError('Invalid fieldname.');
		}

		if (!sublistingId || !isValidUUID(sublistingId) || !fieldName) {
			throw new BadRequestError('Invalid fields to increment counter.');
		}
		const supabase = createSupabaseRLSClient();

		const { error } = await supabase.rpc('increment_field_sublisting', {
			sublisting_id: sublistingId,
			field_name: fieldName,
		});

		if (error) {
			console.error('Error incrementing counter:', error);
			throw new InternalServerError('Error with counter. Contact support.');
		}
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
