// Import Types
// Import External Packages
import Link from 'next/link';
import Image from 'next/image';
// Import Components
import {
	SubSectionContentContainer,
	SubSectionInnerContainer,
	SubSectionOuterContainer,
} from '@/ui/Section';
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

export default function VideoBreaker({ className }: { className?: string }) {
	return (
		<SubSectionOuterContainer id="video-breaker" className={className}>
			<SubSectionInnerContainer>
				<SubSectionContentContainer className="mt-0">
					<div className="w-full z-10 relative isolate overflow-hidden rounded-xl">
						<Image
							src="/img/grilled-chicken.jpg"
							alt="Hero Image"
							className="absolute inset-0 z-20 h-full w-full object-cover"
							width={1920}
							height={1080}
							priority
						/>

						<div className="relative px-12  text-white rounded-xl z-30 mx-auto text-center backdrop-blur-sm h-full w-full flex items-center  py-10">
							<div className="space-y-2 max-w-xl mx-auto">
								<div className="m-auto text-3xl tracking-tight sm:text-7xl font-semibold">
									<h2>REWILD</h2>
								</div>
								<div className="mx-auto w-full">
									<p className="text-base font-medium">
										We&apos;re putting power back in the hands of independent
										food producers - and changing the food system for the
										better.
									</p>
								</div>
								<p className="text-sm leading-6">
									<Link
										href="#"
										className={cn(
											buttonVariants({ variant: 'default', size: 'lg' }),
											'bg-dark-foreground rounded-full text-base'
										)}
									>
										Watch on YouTube
									</Link>
								</p>
							</div>
						</div>
					</div>
				</SubSectionContentContainer>
			</SubSectionInnerContainer>
		</SubSectionOuterContainer>
	);
}
