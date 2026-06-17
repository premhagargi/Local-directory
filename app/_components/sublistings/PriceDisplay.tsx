// Import Types
import { SublistingType } from '@/supabase-special-types';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
import { cn } from '@/lib/utils';
// Import Assets & Icons

export default function PriceDisplay({
	sublisting,
	increaseFontSize = false,
}: {
	sublisting: SublistingType;
	increaseFontSize?: boolean;
}) {
	return (
		<div className="flex gap-x-2 items-end py-1">
			{!!sublisting.price_regular_in_cents && (
				<span
					className={cn(
						!!sublisting.price_promotional_in_cents
							? 'line-through text-sm md:text-base'
							: 'font-semibold text-base md:text-lg',
						increaseFontSize &&
							(!!sublisting.price_promotional_in_cents
								? 'md:text-lg'
								: 'md:text-3xl')
					)}
				>
					{!sublisting.price_promotional_in_cents && 'From '} $
					{(sublisting.price_regular_in_cents / 100).toFixed(2)}
				</span>
			)}
			{!!sublisting.price_promotional_in_cents && (
				<span
					className={cn(
						'font-semibold',
						increaseFontSize ? 'text-lg md:text-3xl' : 'text-base md:text-lg'
					)}
				>
					From ${(sublisting.price_promotional_in_cents / 100).toFixed(2)}
				</span>
			)}
			{!!sublisting.size && <p>/ {sublisting.size}</p>}
		</div>
	);
}
