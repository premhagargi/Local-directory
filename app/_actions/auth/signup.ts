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
import { Roles } from '@/rbac';
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
} from '@/lib/handlingServerResponses';

const SignupFormSchema = z.object({
	email: z
		.string()
		.email({ message: 'Please enter a valid email.' })
		.regex(/^[^+]+$/, { message: "Email may not include a '+' sign" })
		.trim(),
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
	role: z
		.nativeEnum(Roles, {
			message: 'Wrong user role provided. Contact Support!',
		})
		.nullable(),
});

type FormValues = z.infer<typeof SignupFormSchema>;

/**
 * Signs up a user with the provided form data.
 * @param formData - The form data containing the user's email and password (and optionally a role).
 * @returns A promise that resolves to a server response.
 */
export default async function signup(
	formData: FormValues
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = SignupFormSchema.safeParse(formData);

		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}

		const supabase = createSupabaseRLSClient();

		const { error } = await supabase.auth.signUp({
			email: validatedFields.data.email,
			password: validatedFields.data.password,
			options: {
				emailRedirectTo: `${
					process.env.NODE_ENV === 'development'
						? 'http://localhost:3000'
						: COMPANY_BASIC_INFORMATION.URL
				}/account`,
				data: {
					role: validatedFields.data.role,
				},
			},
		});

		if (error) {
			console.error('Error with signup:', error);
			throw new InternalServerError('Error signing you up. Contact Support.');
		}

		await insertActivity('new_signup', validatedFields.data.email);
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
