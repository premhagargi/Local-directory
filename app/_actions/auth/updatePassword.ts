'use server';

// Import Types
// Import External Packages
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import insertActivity from '@/actions/activites/insertActivity';
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
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

const UpdatePasswordFormSchema = z.object({
	password: z
		.string()
		.min(8, { message: 'Be at least 8 characters long' })
		.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
		.regex(/[0-9]/, { message: 'Contain at least one number.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Contain at least one special character.',
		})
		.max(72, { message: 'Be at most 72 characters long' })
		.trim(),
});

type FormValues = z.infer<typeof UpdatePasswordFormSchema>;

/**
 * Updates the user's password.
 *
 * @param state - The state of the update password form.
 * @param formData - The form data containing the new password.
 * @returns A promise that resolves to a server response.
 */
export default async function updatePassword(
	formData: FormValues
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = UpdatePasswordFormSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const supabase = createSupabaseRLSClient();

		const { error } = await supabase.auth.updateUser({
			password: validatedFields.data.password,
		});

		if (error) {
			if (error.code === 'same_password') {
				throw new InternalServerError(
					'You cannot use the same password as before.'
				);
			} else {
				console.error('Error with updating password:', error);
				throw new InternalServerError(
					'Error updating your password. Contact Support.'
				);
			}
		}

		await insertActivity('new_password', 'REDACTED');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
