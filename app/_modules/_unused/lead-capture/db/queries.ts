// Import Types
import { SupabaseClient } from '@supabase/supabase-js';
import { Tables } from '@/app/_types/supabase';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
// Import Assets & Icons

const supabase = createSupabaseBrowserClient();

export const LEAD_TABLE_NAME = 'leads';
export const LEAD_SELECT_PARAMS = `*, listing_name:listings(title), sublisting_name:sublistings(title)`;

// Query For Type Generation
export const leadQuery = supabase
	.from(LEAD_TABLE_NAME)
	.select(LEAD_SELECT_PARAMS);

//
// CRUD HELPER FUNCTIONS
//

/**
 * Creates lead based on user provided data
 *
 * @param supabase - The Supabase client instance used to interact with the database.
 * @param data - The lead data: 'name' | 'email' | 'listing_id' | 'sublisting_id' | 'owner_id' | 'message'
 * @returns A query builder instance that can be used to execute the query.
 */
export const createLeadQuery = (
	supabase: SupabaseClient,
	data: Pick<
		Tables<'leads'>,
		'name' | 'email' | 'listing_id' | 'sublisting_id' | 'owner_id' | 'message'
	>
) => {
	return supabase.from(LEAD_TABLE_NAME).insert(data);
};

/**
 * Selects leads from the database by the owner's ID.
 *
 * @param supabase - The Supabase client instance used to interact with the database.
 * @param ownerId - The ID of the owner whose leads are to be selected.
 * @returns A query builder instance that can be used to execute the query.
 */
export const readLeadsByOwnerIdQuery = (
	supabase: SupabaseClient,
	ownerId: string
) => {
	return supabase
		.from(LEAD_TABLE_NAME)
		.select(LEAD_SELECT_PARAMS)
		.eq('owner_id', ownerId);
};

/**
 * Updates a lead by its ID with the provided data.
 *
 * @param supabase - The Supabase client instance.
 * @param id - The ID of the lead to update.
 * @param data - An object containing the fields to update. Only `status` and `note` fields are allowed.
 * @returns A promise that resolves to an object containing an error, if any occurred.
 */
export async function updateLeadByIdQuery(
	supabase: SupabaseClient,
	id: string,
	data: Pick<Tables<'leads'>, 'status' | 'note'>
): Promise<{ error: any }> {
	return supabase.from(LEAD_TABLE_NAME).update(data).eq('id', id);
}

/**
 * Delets leads from the database by its ID.
 *
 * @param supabase - The Supabase client instance used to interact with the database.
 * @param leadId - The ID of the lead that is to be selected.
 * @returns A query builder instance that can be used to execute the query.
 */
export const deleteLeadByIdQuery = (
	supabase: SupabaseClient,
	leadId: string
) => {
	return supabase.from(LEAD_TABLE_NAME).delete().eq('id', leadId);
};
