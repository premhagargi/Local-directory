import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the session by creating a new NextResponse object with the updated request headers and cookies.
 * Also refreshes the auth token using Supabase.
 * @param request - The NextRequest object containing the original request information.
 * @returns The updated NextResponse object.
 */
export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				/**
				 * Retrieves all cookies from the request.
				 * @returns An array of the request's cookies.
				 */
				getAll() {
					return request.cookies.getAll();
				},
				/**
				 * Sets the provided cookies on both the request and a fresh response.
				 * @param cookiesToSet - The cookies (name, value, options) to set.
				 */
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value)
					);
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// Refreshing the auth token
	await supabase.auth.getUser();

	return response;
}
