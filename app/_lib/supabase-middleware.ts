import { createServerClient, type CookieOptions } from '@supabase/ssr';
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
				 * Retrieves the value of the specified cookie from the request.
				 * @param name - The name of the cookie.
				 * @returns The value of the cookie, or undefined if not found.
				 */
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				/**
				 * Sets a new cookie with the specified name, value, and options in both the request and response.
				 * @param name - The name of the cookie.
				 * @param value - The value of the cookie.
				 * @param options - The options for the cookie.
				 */
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				/**
				 * Removes the specified cookie from both the request and response.
				 * @param name - The name of the cookie to remove.
				 * @param options - The options for the cookie.
				 */
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: '',
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: '',
						...options,
					});
				},
			},
		}
	);

	// Refreshing the auth token
	await supabase.auth.getUser();

	return response;
}
