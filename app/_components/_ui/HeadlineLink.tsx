'use client';

// Import Types
// Import External Packages
import { usePathname } from 'next/navigation';
import { createElement } from 'react';
// Import Components
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/ui/Tooltip';
// Import Functions & Actions & Hooks & State
import { CopyToClipboard, cn, stringToSlug } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { Link } from 'lucide-react';

/**
 * Renders a button that copies the specified text to the clipboard when clicked.
 * @param text The text to be copied to the clipboard.
 * @param className The optional CSS class name for the button.
 * @returns The rendered button component.
 */
export default function HeadlineLink({
	text,
	className,
	hLevel,
	isProse = true,
}: {
	text: string;
	className?: string;
	hLevel?: number;
	isProse?: Boolean;
}) {
	const pathname = usePathname();
	const slug = stringToSlug(text);
	const fullUrl = `${COMPANY_BASIC_INFORMATION.URL}${pathname}/#${slug}`;

	let hClass =
		hLevel === 1
			? 'text-4xl'
			: hLevel === 2
			? 'text-xl'
			: hLevel === 3
			? 'text-lg'
			: hLevel === 4
			? 'text-base'
			: hLevel === 5
			? 'text-sm'
			: 'text-base';
	hClass += ' font-bold scroll-mt-24 flex items-center';

	let hLevelDefined = hLevel || 2;

	const HTag = ({
		text,
		hLevel,
		hClass,
		slug,
	}: {
		text: string;
		hLevel: number;
		hClass: string;
		slug: string;
	}) =>
		createElement(
			`h${hLevel || 2}`,
			{ id: slug, className: hClass },
			text,
			<Link
				className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				size={18}
			/>
		);

	return (
		<div className={cn('group', className)}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							onClick={() =>
								CopyToClipboard(
									fullUrl,
									'Headline link copied! Happy sharing 🚀'
								)
							}
							className="group-hover:underline text-left"
							data-umami-event="Click: Headline Link"
						>
							<span className="sr-only">Copy Headline Link to Clipboard</span>

							<HTag
								hLevel={hLevelDefined}
								hClass={hClass}
								text={text}
								slug={slug}
							/>
						</button>
					</TooltipTrigger>
					<TooltipContent
						className={cn(
							isProse && hLevelDefined === 2 && '-mb-12',
							isProse && hLevelDefined === 3 && '-mb-8'
						)}
					>
						<span className="font-semibold">
							Click to copy the link to this headline:
						</span>
						<br /> {fullUrl}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
