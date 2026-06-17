'use client';
// Import Types
import { ListingType, AuthUserType } from '@/supabase-special-types';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import { userHasPermission, Roles, Permissions } from '@/rbac';
import { cn } from '@/utils';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { BadgePercentIcon } from 'lucide-react';

export default function ListingCardCoupon({
	listing,
	user,
}: {
	listing: ListingType;
	user: AuthUserType | null;
}) {
	if (!listing.discount_code_percentage) {
		return null;
	}

	if (
		GENERAL_SETTINGS.USE_RBAC &&
		(!user ||
			!user.role ||
			!userHasPermission(user.role as Roles, Permissions.ACCESS_COUPON))
	) {
		return <p className="text-xs italic p-1">Login to see discount code.</p>;
	}

	return (
		!!listing.discount_code_percentage && (
			<div
				className={cn(
					'bg-light-red-bg text-text-on-light-red whitespace-nowrap h-fit p-1 rounded-md text-sm font-medium items-center hidden md:flex'
				)}
			>
				<BadgePercentIcon size={14} className="mr-1" />{' '}
				{listing.discount_code_percentage} % off
			</div>
		)
	);
}
