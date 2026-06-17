'use client';
// Import Types
// Import External Packages
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// Import Components
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
import {
	GaugeIcon,
	MessageCircleHeartIcon,
	LayoutTemplateIcon,
	NewspaperIcon,
	GemIcon,
	MegaphoneIcon,
	MessageCircleMoreIcon,
	TagIcon,
	TagsIcon,
	User2Icon,
} from 'lucide-react';
import { GENERAL_SETTINGS } from '../_constants/constants';
// Import Assets & Icons

const ADMIN_NAV_LINKS = [
	{
		label: 'Dashboard',
		href: '/secret-admin',
		icon: GaugeIcon,
	},
	{
		label: 'Activities',
		href: '/secret-admin/activity-manager',
		icon: MessageCircleHeartIcon,
	},
	{
		label: 'Listings',
		href: '/secret-admin/listing-manager',
		icon: LayoutTemplateIcon,
	},
	{
		label: 'Listing Categories',
		href: '/secret-admin/category-manager',
		icon: TagIcon,
	},
	{
		label: 'Listing Tags',
		href: '/secret-admin/tag-manager',
		icon: TagsIcon,
	},
	{
		label: 'Products',
		href: '/secret-admin/sublisting-manager',
		icon: LayoutTemplateIcon,
	},
	{
		label: 'Product Categories',
		href: '/secret-admin/subcategory-manager',
		icon: TagIcon,
	},
	{
		label: 'Product Tags',
		href: '/secret-admin/subtag-manager',
		icon: TagsIcon,
	},
	{
		label: 'Blog Posts',
		href: '/secret-admin/blog-manager',
		icon: NewspaperIcon,
	},
	{
		label: 'Users',
		href: '/secret-admin/user-manager',
		icon: User2Icon,
	},
	{
		label: 'Ads',
		href: '/secret-admin/ad-manager',
		icon: GemIcon,
	},
	{
		label: 'Promotions',
		href: '/secret-admin/promotion-manager',
		icon: MegaphoneIcon,
	},
	{
		label: 'Feedback',
		href: '/secret-admin/feedback-manager',
		icon: MessageCircleHeartIcon,
	},
	{
		label: 'Comments',
		href: '/secret-admin/comment-manager',
		icon: MessageCircleMoreIcon,
	},
];

/**
 * A header component that displays links to account pages.
 */
export default function Sidebar_Admin() {
	const pathname = usePathname();

	return (
		<div className="h-full w-full">
			<header className="sticky top-20 items-start pt-8 h-fit px-2">
				<h2 className="text-lg font-bold py-2">Quick Links</h2>
				<nav className="grid">
					{ADMIN_NAV_LINKS.map(
						(link) =>
							(GENERAL_SETTINGS.USE_SUBLISTINGS ||
								(!GENERAL_SETTINGS.USE_SUBLISTINGS &&
									!link.label.includes('Product'))) && (
								<Link
									key={link.label}
									href={link.href}
									className={cn(
										'text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 p-2 transition-all',
										link.href === pathname ? 'text-foreground bg-muted' : ''
									)}
								>
									{<link.icon className="h-4 w-4 ml-1" />}
									{link.label}
								</Link>
							)
					)}
				</nav>
			</header>
		</div>
	);
}
