import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Handles the POST request for signing out the user.
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with a redirect to the sign-in page.
 */
export async function POST(req: NextRequest) {
	const supabase = createSupabaseRLSClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		await supabase.auth.signOut();
	}

	revalidatePath('/', 'layout');
	return NextResponse.redirect(new URL('/sign-in', req.url), {
		status: 302,
	});
}
