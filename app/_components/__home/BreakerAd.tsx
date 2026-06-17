// Import Types
// Import External Packages
import Image from 'next/image';
// Import Components
import ExternalLink from '@/ui/ExternalLink';
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
import { ExternalLinkIcon } from 'lucide-react';
// Import Data
// Import Assets & Icons

/**
 * A component that displays a promotional ad for BoilerplateHQ.
 */
export default function BreakerAd() {
	return (
		<div className="relative md:w-3/5 mx-auto py-24">
			<div className="relative grid md:grid-cols-3 bg-neutral-100 dark:bg-neutral-100/50 rounded-xl">
				<div className="flex align-middle mx-auto col-span-2 self-center">
					<div className="p-6 mx-auto h-fit">
						<h2 className="text-base font-semibold leading-7 text-foreground">
							Thinking about starting your own business?
						</h2>
						<p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							Become a Directory-Entrepreneur!
						</p>
						<p className="mt-6 text-base leading-7 text-foreground">
							Are you intered in starting your own directory business? Our
							partners at BoilerplateHQ are working on a new project that will
							help you get started. Sign up for their newsletter to be notified
							when it launches!
						</p>
						<div className="mt-8">
							<ExternalLink
								href="https://boilerplatehq.com/templates/directory-website?ref=directorieshq.com"
								className={cn(
									buttonVariants({ variant: 'outline', size: 'lg' }),
									''
								)}
								trusted
								follow
								data-umami-event="Entrepreneur Link Clicked"
							>
								BoilerplateHQ <ExternalLinkIcon className="ml-1" size={16} />
							</ExternalLink>
						</div>
					</div>
				</div>
				<Image
					className="absolute hidden md:block h-80 w-2/5 object-cover rounded-xl drop-shadow-xl rotate-6 -right-12 -bottom-8"
					src="/img/entrepreneur.jpg"
					alt="Directory | Microsoft | Unsplash"
					fetchPriority="high"
					width={600}
					height={400}
				/>
			</div>
		</div>
	);
}
