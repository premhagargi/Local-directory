'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { sublistingsParams } from '@/lib/supabaseQueries';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	UnauthorizedError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves all sublistings for admin users.
 */
export default async function getSublistings_ALL_ADMIN() {
	try {
		const { isSuperAdmin, error: authError } = await serverAuth({
			mustBeAdmin: true,
		});

		if (authError || !isSuperAdmin) {
			throw new UnauthorizedError('Auth Error.');
		}

		const supabase = createSupabaseRLSClient();

		const { data, error } = await supabase
			.from('sublistings')
			.select(sublistingsParams)
			.order('is_admin_published', { ascending: true });
		if (error) {
			console.error('Error getting all sublistings (admin protected):', error);
			throw new InternalServerError(
				'Error getting all sublistings (admin protected):'
			);
		}
		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
