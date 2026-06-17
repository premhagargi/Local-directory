'use client';

// Import Types
import { ListingType } from '@/supabase-special-types';
import { useState } from 'react';
// Import External Packages
// Import Components
import { Button } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { cn, CopyToClipboard } from '@/lib/utils';
import useClientAuth from '@/lib/useClientAuth';
import { Permissions, Roles, userHasPermission } from '@/rbac';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { BadgePercentIcon, ClipboardCopyIcon } from 'lucide-react';

export default function CopyCouponCode({
	listingData,
	className,
}: {
	listingData: ListingType;
	className?: string;
}) {
	const [clicked, setClicked] = useState(false);

	const { userObject: user } = useClientAuth({});

	if (
		!listingData ||
		!listingData.discount_code_percentage ||
		!listingData.discount_code_text ||
		!listingData.discount_code
	) {
		return null;
	}

	if (
		GENERAL_SETTINGS.USE_RBAC &&
		(!user ||
			!user.role ||
			!userHasPermission(user.role as Roles, Permissions.ACCESS_COUPON))
	) {
		return (
			<p className="italic p-1 text-center text-red-500">
				Login to see discount code.
			</p>
		);
	}

	return (
		<div
			className={cn(
				'border border-neutral-300 p-4 flex flex-nowrap md:flex-wrap lg:flex-nowrap justify-center items-center space-x-4 md:space-x-0 lg:space-x-4 space-y-2 lg:space-y-0 rounded-md',
				className
			)}
		>
			<div className="bg-light-red-bg text-text-on-light-red whitespace-nowrap flex h-fit p-1 rounded-md text-sm font-medium items-center">
				<BadgePercentIcon size={14} className="mr-1" />{' '}
				{listingData.discount_code_percentage}% OFF
			</div>
			<p className="text-sm text-justify">{listingData.discount_code_text}</p>
			<p className="flex">
				<Button
					variant="secondary"
					size="sm"
					onClick={() => {
						CopyToClipboard(
							listingData.discount_code!,
							'Coupon code copied to clipboard.'
						),
							setClicked(true);
					}}
					className="w-full grid justify-center items-center place-content-center space-y-1 text-primary shadow-none"
					disabled={clicked}
				>
					<ClipboardCopyIcon size={14} className="mx-auto" />{' '}
					<span className="text-xs">{clicked ? 'Copied!' : 'Copy it'}</span>
				</Button>
			</p>
		</div>
	);
}
