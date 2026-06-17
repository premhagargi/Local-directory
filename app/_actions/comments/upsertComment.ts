'use server';

// Import Types
// Import External Packages
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
	handleServerError,
	handleServerSuccess,
	ServerResponse,
	UnauthorizedError,
} from '@/lib/handlingServerResponses';
import { revalidatePath } from 'next/cache';

const CommentFormSchema = z.object({
	content: z
		.string()
		.max(1000, { message: 'Should be max least 1000 characters long' })
		.optional(),
	parent_comment_id: z.string().optional(),
	blog_or_listing_id: z.string(),
	blog_or_listing: z.enum(['blog_post_id', 'listing_id', 'sublisting_id']),
});

export default async function upsertComment(
	formData: z.infer<typeof CommentFormSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = CommentFormSchema.safeParse(formData);
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

		let comment = {
			user_id: user.id,
			content: validatedFields.data.content,
			parent_comment_id: validatedFields.data.parent_comment_id || null,
			[validatedFields.data.blog_or_listing]:
				validatedFields.data.blog_or_listing_id,
		};

		const { error: commentError } = await supabase.from('comments').insert({
			...comment,
		});

		if (commentError) {
			console.error('Error handling comment:', commentError);
			throw new InternalServerError('Error storing comment');
		}
		revalidatePath('/secret-admin/comment-manager');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
