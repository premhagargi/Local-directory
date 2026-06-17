// Import Types
import { Database } from '@/supabase-types';
// Import External Packages
import { createBrowserClient } from '@supabase/ssr';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

/**
 * Creates a Supabase client for browser environment. This value does not rely on cookies - thus it will not be able to access user-specific data or any RLS-protected data. It is useful for public data.
 * @returns The Supabase client.
 */
export default function createSupabaseBrowserClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
