'use server';

// Import Types
// Import External Packages
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	HookFormError,
	UnauthorizedError,
} from '@/lib/handlingServerResponses';

const CommentApprovalFormSchema = z.object({
	id: z.string().optional(),
	is_approved: z.boolean().optional(),
});

/**
 * Approves a comment.
 *
 * @param formData - The form data containing the comment approval information.
 * @returns An object indicating the success of the operation.
 */
export default async function approveComment_ADMIN(
	formData: z.infer<typeof CommentApprovalFormSchema>
) {
	const validatedFields = CommentApprovalFormSchema.safeParse(formData);
	if (!validatedFields.success) {
		throw new HookFormError(validatedFields.error.flatten().fieldErrors);
	}

	const { isSuperAdmin, error: authError } = await serverAuth({
		mustBeAdmin: true,
		checkUser: true,
	});

	if (authError || !isSuperAdmin) {
		throw new UnauthorizedError('Auth Error.');
	}

	const supabase = createSupabaseRLSClient();

	const { error: commentError } = await supabase
		.from('comments')
		.update({
			is_approved: validatedFields.data.is_approved,
		})
		.match({ id: validatedFields.data.id });

	if (commentError) {
		console.error('Error updating comment:', commentError);
		throw new InternalServerError('Error updating comment');
	}

	revalidatePath('/', 'layout');

	return { errors: {}, success: true };
}
