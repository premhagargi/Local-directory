'use server';

// Import Types
// Import External Packages
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { formDataToObject } from '@/utils';
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

type feedbackStateType =
	| {
			errors?:
				| {
						feedback_type?: string[] | undefined;
						url?: string[] | undefined;
						description?: string[] | undefined;
				  }
				| undefined;
			success?: boolean | undefined;
	  }
	| undefined;

// Define the Zod schema for the feedback form
const feedbackSchema = z.object({
	feedback_type: z.enum(['propose', 'report', 'feedback']),
	url: z.string().url().min(3, { message: 'be at least 3 characters long.' }),
	description: z
		.string()
		.min(10, { message: 'be at least 10 characters long.' }),
	email: z
		.string()
		.optional()
		.refine(
			(value) => value === '' || value === undefined || value.length >= 2,
			{
				message: 'be correctly formatted.',
			}
		),
});

/**
 * Inserts feedback into the database.
 *
 * @param state - The feedback state.
 * @param formData - The form data containing the feedback information.
 * @returns A promise that resolves to a server response.
 */
export default async function insertFeedback(
	state: feedbackStateType,
	formData: FormData
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const formatedFormData = formDataToObject(formData);

		const validatedFields = feedbackSchema.safeParse(formatedFormData);

		if (!validatedFields.success) {
			throw new HookFormError(
				validatedFields.error.flatten().fieldErrors as feedbackStateType
			);
		}

		const supabase = createSupabaseRLSClient();

		const { error } = await supabase.from('feedback').insert(formatedFormData);

		if (error) {
			console.error('Error storing feedback:', error);
			throw new InternalServerError('Error storing feedback');
		}
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
