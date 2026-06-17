'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
// Import Data
import { readLeadsByOwnerIdQuery } from '../db/queries';
// Import Assets & Icons
// Import Error Handling
import {
	BadRequestError,
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves Leads by owner ID.
 *
 * @param ownerId - The owner ID to filter Leads by.
 * @returns A promise that resolves to the Leads data if successful, or an error if the operation fails.
 * @throws {BadRequestError} If the owner ID is invalid.
 * @throws {InternalServerError} If there is an error retrieving Leads from the database.
 */
export default async function getLeadsByOwnerId(ownerId: string) {
	try {
		if (!ownerId) {
			throw new BadRequestError('Invalid fields to handle Lead search.');
		}
		const supabase = createSupabaseRLSClient();

		const { data, error } = await readLeadsByOwnerIdQuery(supabase, ownerId);

		if (error) {
			console.error('Error handling Lead search:', error);
			throw new InternalServerError('Error retrieving Leads. Contact Support.');
		}

		return handleServerSuccess(data);
	} catch (error) {
		return handleServerError(error, []);
	}
}
