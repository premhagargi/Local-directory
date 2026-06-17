'use server';

// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
// Import Assets & Icons
// Import Error Handling
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';

/**
 * Retrieves a published listing by its slug.
 * @param slug - The slug of the listing.
 * @returns The data of the published listing, or null if not found or an error occurred.
 */
export default async function getPublishedListingsAsKeyValuePair() {
	try {
		const supabase = createSupabaseBrowserClient();

		const { data, error } = await supabase
			.from('listings')
			.select(`id, title`)
			.match({ is_user_published: true, is_admin_published: true });
		if (error) {
			console.error('Error finding listing by Slug:', error);
			throw new InternalServerError(
				'Error retrieving listings. Contact Support.'
			);
		}

		const keyValuePairs = data
			.map((listing) => ({
				value: listing.id,
				label: listing.title,
			}))
			.sort((a, b) => {
				const nameA = a.label.toUpperCase();
				const nameB = b.label.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});

		return handleServerSuccess(keyValuePairs);
	} catch (error) {
		return handleServerError(error, []);
	}
}
