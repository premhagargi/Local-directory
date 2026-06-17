// Import Types
// Import External Packages
import Image from 'next/image';
import Link from 'next/link';
// Import Components
import {
	SubSectionOuterContainer,
	SubSectionInnerContainer,
	SubSectionContentContainer,
} from '@/ui/Section';
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

/**
 * A component that displays a breaker ad.
 */
export default function Breaker({
	className,
	imageSrc,
	imageAlt,
	subHeadline,
	headline,
	description,
	buttonText,
	buttonHref,
}: {
	className?: string;
	imageSrc: string;
	imageAlt: string;
	subHeadline: string;
	headline: string;
	description: string;
	buttonText: string;
	buttonHref: string;
}) {
	return (
		<SubSectionOuterContainer className={className}>
			<SubSectionInnerContainer>
				<SubSectionContentContainer className="mt-0">
					<div className="md:flex rounded-lg bg-white dark:bg-background-secondary">
						<Image
							className="h-60 w-auto object-cover rounded-xl drop-shadow-xl -rotate-6 hidden md:block"
							src={imageSrc || '/img/placeholder.png'}
							alt={imageAlt || 'placeholder image'}
							fetchPriority="high"
							width={600}
							height={400}
						/>

						<div className="w-full">
							<div className="p-6 xl:p-8 mx-auto flex flex-col flex-grow">
								<h2 className="text-base font-semibold leading-7 text-muted-foreground">
									{subHeadline}
								</h2>
								<p className="my-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl uppercase">
									{headline}
								</p>
								<Image
									className="h-auto w-full object-cover rounded-lg md:hidden"
									src={imageSrc || '/img/placeholder.png'}
									alt={imageAlt || 'placeholder image'}
									fetchPriority="high"
									width={600}
									height={400}
								/>
								<p className="mt-4 text-base leading-7 text-muted-foreground max-w-xl ">
									{description}
								</p>
								<div className="mt-2">
									<Link
										href={buttonHref}
										className={cn(
											buttonVariants({ variant: 'outline', size: 'lg' }),
											'bg-white dark:hover:bg-white/70 dark:text-black rounded-full text-foreground py-4 border border-black'
										)}
										prefetch={false}
										data-umami-event={`Button Clicked: ${buttonText}`}
									>
										{buttonText}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</SubSectionContentContainer>
			</SubSectionInnerContainer>
		</SubSectionOuterContainer>
	);
}
