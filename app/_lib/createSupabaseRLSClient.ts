// Import Types
import { Database } from '@/supabase-types';
// Import External Packages
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

/**
 * Creates a Supabase client for server environment. This value relies on cookies - thus it will be able to access user-specific data and any RLS-protected data. It is useful for private data.
 * @returns The Supabase client.
 */
export default function createSupabaseRLSClient() {
	const cookieStore = cookies();

	// Create a server's supabase client with newly configured cookie,
	// which could be used to maintain user's session
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch (error) {
						// The `delete` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		}
	);
}
