// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
// Import Functions & Actions & Hooks & State
import { cn, parseHeadersFromMDXString } from '@/lib/utils';
// Import Data
// Import Assets & Icons

/**
 * Renders a table of contents based on the provided MDX content.
 *
 * @param mdxContent - The MDX content to generate the table of contents from.
 * @param title - The title of the table of contents (default: 'Table of Contents').
 * @returns The rendered table of contents component.
 */
export default function TableOfContents_MDX({
	mdxContent,
	title = 'Table of Contents',
}: {
	mdxContent: string;
	title?: string;
}) {
	const headers = parseHeadersFromMDXString(mdxContent);

	return (
		<div id="table-of-contents" className="sticky top-[180px] mx-auto">
			<h2 className="font-semibold text-sm dark:text-white">{title}</h2>
			<ul className="space-y-1 py-2">
				{headers.map((header, index) => (
					<li key={index} className={cn(`pl-${(header.level - 1) * 2}`)}>
						<Link
							className={cn(
								'block text-sm leading-6 hover:text-primary transition-colors duration-200 ease-in-out dark:text-white',
								header.level < 2
									? 'mt-2'
									: 'text-muted-foreground dark:text-white'
							)}
							href={`#${header.slug}`}
						>
							{header.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
