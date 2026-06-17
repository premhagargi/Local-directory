// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import { cn } from '@/utils';
// Import Data
// Import Assets & Icons

export default function TopBanner({ className }: { className?: string }) {
	return (
		<section className={cn('w-full mx-auto bg-primary py-2', className)}>
			<p className="text-sm leading-6 text-primary-foreground text-center">
				Free Shipping on orders over $149 anywhere in the US (except AK & HI).
			</p>
		</section>
	);
}
