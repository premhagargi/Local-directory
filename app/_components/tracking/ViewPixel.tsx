'use client';

// Import Types
// Import External Packages
import { useEffect } from 'react';
// Import Components
// Import Functions & Actions & Hooks & State
import incrementStatCounters from '@/actions/listings/incrementStatCounters';
// Import Data
// Import Assets & Icons

/**
 * Renders a view pixel component.
 *
 * @param listingId - The ID of the listing.
 * @returns The view pixel component.
 */
export default function ViewPixel({ listingId }: { listingId: string }) {
	useEffect(() => {
		if (!listingId) return;
		incrementStatCounters(listingId, 'views');
	}, [listingId]);

	return <>{null}</>;
}
