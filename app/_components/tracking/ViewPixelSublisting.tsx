'use client';

// Import Types
// Import External Packages
import { useEffect } from 'react';
// Import Components
// Import Functions & Actions & Hooks & State
import incrementStatCounters from '@/actions/sublistings/incrementStatCounters';
// Import Data
// Import Assets & Icons

/**
 * Renders a view pixel component.
 *
 * @param listingId - The ID of the listing.
 * @returns The view pixel component.
 */
export default function ViewPixelSublisting({
	sublistingId,
}: {
	sublistingId: string;
}) {
	useEffect(() => {
		if (!sublistingId) return;
		incrementStatCounters(sublistingId, 'views');
	}, [sublistingId]);

	return <>{null}</>;
}
