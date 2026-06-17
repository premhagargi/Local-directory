'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

/**
 * Retrieves promotions by user ID.
 * @param user_id - The ID of the user.
 * @returns A promise that resolves to the promotions data.
 */
export default async function getPromotionsByUserId(user_id: string) {
	try {
		const supabase = createSupabaseBrowserClient();
		const { data, error } = await supabase
			.from('promotions')
			.select('*,listing:listings!inner(title, category_id)')
			.eq('profile_id', user_id);

		if (error) {
			console.error('Error getting promotions by profileid.', error);
			throw new InternalServerError('Error getting promotions by profileid');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
