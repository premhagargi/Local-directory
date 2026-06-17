// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
import { ScrollArea, ScrollBar } from '@/ui/ScrollArea';
import { Badge } from '@/ui/Badge';
// Import Functions & Actions & Hooks & State
import { cn, stringToSlug } from '@/lib/utils';
import getPartialCategories from '@/actions/categories/getPartialCategories';
// Import Data
// Import Assets & Icons

/**
 * A bar of badges that link to a specific page.
 * @param type - The type of badges to display.
 * @param text - The text to display above the badges.
 * @param hrefPrefix - The prefix to add to the href of each badge.
 * @param className - The class name to apply to the badge bar.
 * @param badgeClassName - The class name to apply to each badge.
 * @param variant - The variant of the badges.
 * @param withScroll - Whether to show a scroll bar for the badges.
 */
export default async function CategoryBar({
	text = 'Trending Categories',
	hrefPrefix = '/explore?categories=',
	className,
	badgeClassName,
	variant = 'outline',
	withScroll = true,
	maxNumBadges = 4,
}: {
	text?: string;
	hrefPrefix?: string;
	className?: string;
	badgeClassName?: string;
	variant?: 'outline' | 'huge';
	withScroll?: boolean;
	maxNumBadges?: number;
}) {
	let { data: items } = await getPartialCategories('active');

	items = items.slice(0, maxNumBadges);

	return (
		<div
			className={cn('flex gap-2 items-center self-center w-full', className)}
		>
			<span className="text-xs text-muted-foreground italic hidden md:block whitespace-nowrap">
				{text}
			</span>
			{withScroll ? (
				<ScrollArea className="py-4 whitespace-nowrap">
					{items.map((item) => (
						<Link
							key={item.name}
							href={`${hrefPrefix}${stringToSlug(item.name!)}`}
							className="px-1"
							data-umami-event="Badge Clicked"
							data-umami-event-item={item.name}
						>
							<Badge
								variant={variant}
								className={cn(' whitespace-nowrap', badgeClassName)}
							>
								{item.name}
							</Badge>
						</Link>
					))}
					<Link
						href="/category"
						className="px-1"
						data-umami-event="Badge Clicked"
						data-umami-event-item="All"
					>
						<Badge
							variant={variant}
							className={cn(' whitespace-nowrap', badgeClassName)}
						>
							more+
						</Badge>
					</Link>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			) : (
				items.map((item) => (
					<Link
						key={item.name}
						href={`${hrefPrefix}${stringToSlug(item.name!)}`}
						className="px-1"
						data-umami-event="Badge Clicked"
						data-umami-event-item={item.name}
					>
						<Badge
							variant={variant}
							className={cn(' whitespace-nowrap', badgeClassName)}
						>
							{item.name}
						</Badge>
					</Link>
				))
			)}
		</div>
	);
}
