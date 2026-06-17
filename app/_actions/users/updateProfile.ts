'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import { formDataToObject } from '@/lib/utils';
import serverAuth from '@/actions/auth/serverAuth';
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
	UnauthorizedError,
} from '@/lib/handlingServerResponses';

type UpdateFormState =
	| {
			errors?:
				| {
						username?: string[] | undefined;
						full_name?: string[] | undefined;
						website?: string[] | undefined;
						avatar_url?: string[] | undefined;
						tag_line?: string[] | undefined;
				  }
				| undefined;
			success?: boolean | undefined;
	  }
	| undefined;

const ProfileFormSchema = z.object({
	username: z.string().min(3, { message: 'Be at least 3 characters long' }),
	tag_line: z.string().optional(),
	full_name: z
		.string()
		.optional()
		.refine(
			(value) => value === '' || value === undefined || value.length >= 2,
			{
				message: 'Full name must be at least 2 characters long',
			}
		),
	website: z
		.string()
		.optional()
		.refine(
			(value) => {
				if (value === '' || value === undefined) return true;
				try {
					new URL(value);
					return true;
				} catch (e) {
					return false;
				}
			},
			{
				message: 'Invalid URL',
			}
		),
	avatar_url: z.string().optional(),
});

/**
 * Updates the user profile with the provided form data.
 *
 * @param state - The state of the update form.
 * @param formData - The form data to update the profile with.
 * @returns A promise that resolves to a server response containing the updated profile data.
 */
export default async function updateProfile(
	state: UpdateFormState,
	formData: FormData
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const formatedFormData = formDataToObject(formData);

		const validatedFields = ProfileFormSchema.safeParse(formatedFormData);
		if (!validatedFields.success) {
			throw new HookFormError(validatedFields.error.flatten().fieldErrors);
		}
		const { user, error: authError } = await serverAuth({
			mustBeSignedIn: true,
			checkUser: true,
		});

		if (authError || !user) {
			throw new UnauthorizedError('Auth Error.');
		}

		const supabase = createSupabaseRLSClient();

		const { error } = await supabase
			.from('users')
			.update({
				username: formData.get('username') as string,
				full_name: formData.get('full_name') as string,
				website: formData.get('website') as string,
				avatar_url: formData.get('avatar_url') as string,
				tag_line: formData.get('tag_line') as string,
				updated_at: new Date().toISOString(),
			})
			.eq('id', user.id);

		if (error) {
			console.error('Error with updating a profile:', error);
			throw new InternalServerError(
				'Error updating your profile. Contact Support.'
			);
		}
		revalidatePath('/', 'layout');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
