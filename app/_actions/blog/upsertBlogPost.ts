'use server';

// Import Types
// Import External Packages
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import serverAuth from '@/actions/auth/serverAuth';
import { isValidUUID, stringToSlug } from '@/lib/utils';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	HookFormError,
	handleServerError,
	handleServerSuccess,
	ServerResponse,
	UnauthorizedError,
	BadRequestError,
} from '@/lib/handlingServerResponses';

const BlogPostFormSchema = z.object({
	id: z.optional(z.string()),
	title: z.string().min(2, { message: 'Should at least 2 characters long' }),
	description: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
	topic_id: z.string().min(2, { message: 'Category is missing.' }),
	content: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
	default_image_url: z
		.string()
		.optional()
		.refine(
			(value) => value === '' || value === undefined || value.length >= 2,
			{
				message: 'Full name must be at least 2 characters long',
			}
		),
	is_user_published: z.optional(z.boolean().nullable()),
	is_admin_approved: z.optional(z.boolean().nullable()),
	keywords: z.string().optional(),
	published_at: z.string().nullable(),
});

/**
 * Upserts a blog post.
 *
 * @param formData - The form data for the blog post.
 * @returns A promise that resolves to a server response.
 */
export default async function upsertBlogPost(
	formData: z.infer<typeof BlogPostFormSchema>
): Promise<ServerResponse<any, Record<string, string[]>>> {
	try {
		const validatedFields = BlogPostFormSchema.safeParse(formData);
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

		if (!validatedFields.data.id || validatedFields.data.id === '') {
			const adminApproved =
				validatedFields.data.is_admin_approved === true
					? true
					: GENERAL_SETTINGS.PRE_ADMIN_APPROVE_BLOGPOSTS;
			const keywordArray = validatedFields.data.keywords?.split(',') || [];
			delete validatedFields.data.id;
			delete validatedFields.data.is_admin_approved;
			delete validatedFields.data.keywords;

			const { data: newBlogPost, error: postError } = await supabase
				.from('blog_posts')
				.insert({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.title),
					user_id: user.id,
					is_admin_approved: adminApproved,
					keywords: keywordArray,
				})
				.select('id')
				.single();

			if (postError || !newBlogPost.id) {
				console.error('Error inserting blog post:', postError);
				throw new InternalServerError(
					'Error storing blog post. Contact Support.'
				);
			}
		} else {
			if (!isValidUUID(validatedFields.data.id)) {
				console.error('Invalid fields uuid to handle blog post update.');
				throw new BadRequestError('Invalid fields. Contact Support.');
			}
			const keywordArray = validatedFields.data.keywords?.split(',') || [];
			delete validatedFields.data.keywords;
			const { data: updatedBlogPost, error: postError } = await supabase
				.from('blog_posts')
				.update({
					...validatedFields.data,
					slug: stringToSlug(validatedFields.data.title),
					updated_at: new Date().toISOString(),
					keywords: keywordArray,
				})
				.eq('id', validatedFields.data.id)
				.select('id')
				.single();

			if (postError || !updatedBlogPost.id) {
				console.error('Error inserting blog post:', postError);
				throw new InternalServerError(
					'Error storing blog post. Contact Support.'
				);
			}
		}
		revalidateTag('all-published-blog-posts');
		revalidateTag(`post-${stringToSlug(validatedFields.data.title)}`);
		revalidateTag('all-blog-slugs');

		revalidatePath('/blog', 'page');
		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}
