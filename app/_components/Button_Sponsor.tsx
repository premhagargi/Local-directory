'use client';

// Import Types
// Import External Packages
// Import Components
import { buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons
import { ExternalLinkIcon } from 'lucide-react';

/**
 * Renders a button component that scrolls the page to the top when clicked.
 *
 * @param buttonText - The text to display on the button. Default is 'Back to top'.
 * @param className - Additional CSS class names to apply to the button.
 */
export default function Button_Sponsor({
	buttonText = 'Template by BoilerplateHQ.com',
	className,
	href = 'https://boilerplatehq.com/templates/directory-website?ref=directorieshq.com',
}: {
	buttonText?: string;
	className?: string;
	href?: string;
}) {
	return (
		<a
			className={cn(
				buttonVariants({ variant: 'secondary' }),
				'fixed hidden md:inline-flex bottom-4 left-6 z-50',
				className
			)}
			data-umami-event="Sponsor Button"
			href={href}
			target="_blank"
		>
			{buttonText}
			<ExternalLinkIcon size={12} className="ml-1" />
		</a>
	);
}
