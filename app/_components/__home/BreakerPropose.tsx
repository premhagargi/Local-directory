// Import Types
// Import External Packages
import Image from 'next/image';
import Link from 'next/link';
// Import Components
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
import { PlusIcon } from 'lucide-react';

/**
 * A component that displays a breaker ad.
 */
export default function BreakerPropose({ className }: { className?: string }) {
	return (
		<div className={cn('relative max-w-screen-md mx-auto py-24', className)}>
			<div className="relative grid md:grid-cols-3 bg-neutral-100 dark:bg-neutral-100/50 rounded-xl">
				<div className="flex align-middle mx-auto col-span-2 self-center">
					<div className="p-6 xl:p-8 mx-auto h-fit">
						<h2 className="text-base font-semibold leading-7 text-foreground">
							Know any missing listings?
						</h2>
						<p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							Propose A Listing
						</p>
						<p className="mt-6 text-base leading-7 text-foreground">
							Help us grow our directory by proposing a listing that you think
							should be included. We appreciate your help!
						</p>
						<div className="mt-8">
							<Link
								href="/propose"
								className={cn(
									buttonVariants({ variant: 'outline', size: 'lg' }),
									''
								)}
								prefetch={false}
								data-umami-event="Propose Link Clicked"
							>
								<PlusIcon className="mr-1" size={18} />
								Propose a listing
							</Link>
						</div>
					</div>
				</div>
				<div className="col-span-1" />
				<Image
					className="absolute hidden md:block h-80 w-2/5 object-cover rounded-xl drop-shadow-xl rotate-6 -right-12 -bottom-8"
					src="/img/propose.jpg"
					alt="Photo by John Schnobrich on Unsplash"
					fetchPriority="high"
					width={600}
					height={400}
				/>
			</div>
		</div>
	);
}
