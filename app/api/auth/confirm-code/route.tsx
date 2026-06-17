import { type NextRequest, NextResponse } from 'next/server';
import createSupabaseRLSClient from '@/lib/createSupabaseRLSClient';
import { COMPANY_BASIC_INFORMATION } from '@/constants';

/**
 * Handles the GET request for confirming the code.
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with a redirect to the update password page.
 */
export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get('code');

	if (code) {
		const supabase = createSupabaseRLSClient();

		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error(error);
			return NextResponse.redirect(
				`${
					process.env.NODE_ENV === 'development'
						? 'http://localhost:3000'
						: COMPANY_BASIC_INFORMATION.URL
				}/forgot-password`
			);
		}
	}

	return NextResponse.redirect(
		`${
			process.env.NODE_ENV === 'development'
				? 'http://localhost:3000'
				: COMPANY_BASIC_INFORMATION.URL
		}/update-password`
	);
}
