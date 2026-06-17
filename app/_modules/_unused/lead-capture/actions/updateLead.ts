'use server';

// Import Types
import { LeadFormUpdateDataType, LeadFormUpdateSchema } from '../types/types';
// Import External Packages
import { revalidatePath } from 'next/cache';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { updateLeadByIdQuery } from '../db/queries';
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

export default async function updateLead(
	formData: LeadFormUpdateDataType
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = LeadFormUpdateSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const supabase = createSupabaseRLSClient();

		const updateData = {
			status: validatedFields.data.status,
			note: validatedFields.data.note ?? null,
		};

		const LeadId = validatedFields.data.id;

		const { error: LeadError } = await updateLeadByIdQuery(
			supabase,
			LeadId,
			updateData
		);

		if (LeadError) {
			console.error('Error updating Lead:', LeadError);
			throw new InternalServerError('Error updating Lead');
		}
		revalidatePath('/account/Leads', 'page');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
