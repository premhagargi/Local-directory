'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
// Import Data
import { deleteLeadByIdQuery } from '../db/queries';
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Deletes lead based on Lead ID
 * @param leadId - The lead ID to delete.
 * @returns A promise that resolves to the retrieved leads.
 */
export default async function deleteLead(leadId: string) {
	try {
		const supabase = createSupabaseRLSClient();

		const { error } = await deleteLeadByIdQuery(supabase, leadId);

		if (error) {
			console.error('Error updating lead:', error);
			throw new InternalServerError('Error updating lead');
		}
		revalidatePath('/account/leads', 'page');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
