// Import Types
// Import External Packages
// Import Components
import { SubSectionDescription, SubSectionTitle } from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import { cn } from '@/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

const testimonials = [
	{
		quote: 'This directory has been a game-changer for my business.',
		name: 'Testimonial 1',
		title: 'Owner, Acme Inc.',
		img_url:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		href: '#',
		highlighted: false,
	},
	{
		quote:
			"This directory has been a game-changer for my business. The leads I've received have been high-quality and have led to significant growth. This directory has been a game-changer for my business. The leads I've received have been high-quality and have led to significant growth.",
		name: 'Testimonial 2',
		title: 'Owner, Acme Inc.',
		img_url:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		href: '',
		highlighted: false,
	},
	{
		quote:
			"This directory has been a game-changer for my business. The leads I've received have been high-quality and have led to significant growth.",
		name: 'Testimonial 3',
		title: 'Owner, Acme Inc.',
		img_url:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		href: '#',
		highlighted: true,
	},
	{
		quote:
			"This directory has been a game-changer for my business. The leads I've received have been high-quality and have led to significant growth. This directory has been a game-changer for my business. The leads I've received have been high-quality and have led to significant growth.",
		name: 'Testimonial 4',
		title: 'Owner, Acme Inc.',
		img_url:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		href: '',
		highlighted: false,
	},
	{
		quote:
			"This directory has been a game-changer for my business. The leads I've received have been high-quality and have led to significant growth.",
		name: 'Testimonial 5',
		title: 'Owner, Acme Inc.',
		img_url:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		href: '',
		highlighted: false,
	},
];

/**
 * A component showing testimonials
 */

export default function TestimonialGrid({ className }: { className?: string }) {
	return (
		<section className={cn('w-full py-12 mx-auto', className)}>
			<SubSectionTitle className="text-center">
				What Our Customers Say
			</SubSectionTitle>
			<SubSectionDescription className="text-center">
				Hear from real people who have used our directory to grow their
				business.
			</SubSectionDescription>

			<div className="colums-1 md:columns-2 xl:columns-3 w-full">
				{testimonials.map((testimonial) => (
					<div
						key={testimonial.name}
						className="pt-8 sm:inline-block w-full px-2 "
					>
						<figure
							className={cn(
								'rounded-lg bg-background p-6 relative inline-block border border-neutral-300',
								testimonial.href &&
									testimonial.href !== '' &&
									'cursor-pointer hover:shadow-md dark:hover:bg-neutral-800'
							)}
						>
							<div className="grid gap-2">
								<blockquote>
									<p
										className={cn(
											'text-base text-foreground/80 dark:text-white',
											testimonial.highlighted && 'font-semibold'
										)}
									>
										{`"${testimonial.quote}"`}
									</p>
								</blockquote>
								<figcaption className="flex items-center gap-2">
									<picture>
										<img
											className="h-10 w-10 rounded-full bg-muted"
											src={testimonial.img_url}
											alt={`Testimonial by ${testimonial.name} for ${COMPANY_BASIC_INFORMATION.NAME}`}
										/>
									</picture>
									<div>
										<div className="font-medium">{testimonial.name}</div>
										<div className="text-sm text-muted-foreground">
											{testimonial.title}
										</div>
									</div>
								</figcaption>
							</div>
							{testimonial.href && testimonial.href !== '' && (
								<a className="absolute inset-0" href={testimonial.href}>
									<span className="sr-only">
										External link to {testimonial.href}
									</span>
								</a>
							)}
						</figure>
					</div>
				))}
			</div>
		</section>
	);
}
