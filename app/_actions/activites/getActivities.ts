'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
	UnauthorizedError,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves activities from the server.
 * @param limit - The maximum number of activities to retrieve. Default is 10.
 * @param skip - The number of activities to skip. Default is 0.
 * @param type - The type of activities to retrieve. Default is an empty string.
 * @returns A promise that resolves to the retrieved activities.
 */
export default async function getActivities(
	limit: number = 10,
	skip: number = 0,
	type: string = ''
) {
	try {
		const { error: adminerror } = await serverAuth({
			checkAdmin: true,
			mustBeAdmin: true,
		});
		if (adminerror) {
			throw new UnauthorizedError('Auth Error.');
		}
		const supabase = createSupabaseRLSClient();

		let actitivityQuery = supabase
			.from('activities')
			.select('*', { count: 'exact' })
			.order('created_at', { ascending: false })
			.range(skip, skip + limit - 1)
			.limit(limit);

		if (type && type !== 'all' && type !== '') {
			actitivityQuery = actitivityQuery.eq('type', type);
		}

		const { data, error, count } = await actitivityQuery;

		if (error) {
			console.error('Error getting activities:', error);
			throw new InternalServerError(
				'Error with activity request. Contact Support.'
			);
		}
		return handleServerSuccess(data, count || undefined);
	} catch (error) {
		return handleServerError(error, []);
	}
}
