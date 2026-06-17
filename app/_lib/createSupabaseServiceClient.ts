// Import Types
// Import External Packages
import { createClient } from '@supabase/supabase-js';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

// WARNING: DO NOT USE THIS IN THE CLIENT-SIDE CODE
// THE SUPABASE_SERVICE_ROLE_KEY IS A SECRET KEY THAT SHOULD NOT BE SHARED
// THIS FILE IS FOR SERVER-SIDE USE ONLY
// THIS SUPABASE CLIENT SHOULD BE USED FOR SERVER-SIDE OPERATIONS - SUCH AS API ROUTES OR CRON JOBS

export default function createSupabaseServiceClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				persistSession: false,
				autoRefreshToken: false,
				detectSessionInUrl: false,
			},
		}
	);
}
