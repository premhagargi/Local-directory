'use server';

// Import Types
// Import External Packages
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import insertActivity from '@/actions/activites/insertActivity';
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
} from '@/lib/handlingServerResponses';

const ForgotPasswordFormSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
});

type FormValues = z.infer<typeof ForgotPasswordFormSchema>;

/**
 * Sends a forgot password request to the server.
 * @param state - The state of the forgot password form.
 * @param formData - The form data containing the email.
 * @returns A promise that resolves to the server response.
 */
export default async function forgotPassword(
	formData: FormValues
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = ForgotPasswordFormSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const supabase = createSupabaseRLSClient();

		const { error } = await supabase.auth.resetPasswordForEmail(
			validatedFields.data.email,
			{
				redirectTo: `${
					process.env.NODE_ENV === 'development'
						? 'http://localhost:3000'
						: COMPANY_BASIC_INFORMATION.URL
				}/api/auth/confirm-code`,
			}
		);

		if (error) {
			console.error('Error with reset password:', error);
			throw new InternalServerError(
				'Error ressetting your password. Contact Support.'
			);
		}
		await insertActivity('reset_password', validatedFields.data.email);
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
