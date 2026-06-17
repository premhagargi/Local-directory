'use server';

// Import Types
import { LeadFormInsertDataType, LeadFormInsertSchema } from '../types/types';
// Import External Packages
import { revalidatePath } from 'next/cache';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { createLeadQuery } from '../db/queries';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
} from '@/lib/handlingServerResponses';

/**
 * Upserts an lead based on the provided form data.
 *
 * @param {LeadFormInsertDataType} formData - The data from the lead form to be inserted or updated.
 * @returns {Promise<ServerResponse<any, Record<string, string[]>>>} - A promise that resolves to a server response.
 *
 * @throws {HookFormError} - If the form data validation fails.
 * @throws {InternalServerError} - If there is an error storing the lead.
 */
export default async function createLead(
	formData: LeadFormInsertDataType
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = LeadFormInsertSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		if (!validatedFields.data.listingId && !validatedFields.data.sublistingId) {
			console.error(
				'Error handling lead. No listing or sublisting ID provided. Please try again.'
			);
			throw new InternalServerError('Error storing lead. Please try again.');
		}

		const supabase = createSupabaseBrowserClient();

		let lead = {
			name: validatedFields.data.name,
			email: validatedFields.data.email,
			listing_id:
				!validatedFields.data.listingId || validatedFields.data.listingId === ''
					? null
					: validatedFields.data.listingId,
			sublisting_id:
				!validatedFields.data.sublistingId ||
				validatedFields.data.sublistingId === ''
					? null
					: validatedFields.data.sublistingId,
			owner_id:
				!validatedFields.data.ownerId || validatedFields.data.ownerId === ''
					? null
					: validatedFields.data.ownerId,
			message:
				!validatedFields.data.message || validatedFields.data.message === ''
					? null
					: validatedFields.data.message,
		};

		const { error: leadError } = await createLeadQuery(supabase, lead);

		if (leadError) {
			console.error('Error handling lead:', leadError);
			throw new InternalServerError('Error storing lead');
		}
		revalidatePath('/account/leads', 'page');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
