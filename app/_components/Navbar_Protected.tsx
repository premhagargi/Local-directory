'use client';
// Import Types
import { AuthUserType } from '@/supabase-special-types';
// Import External Packages
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// Import Components
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/ui/Sheet';
import { Button, buttonVariants } from '@/ui/Button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@/ui/Dropdown';
import { Skeleton } from '@/ui/Skeleton';
// Import Functions & Actions & Hooks & State
import useClientAuth from '@/lib/useClientAuth';
import { cn } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
import { Permissions, Roles, userHasPermission } from '@/rbac';
// Import Assets & Icons
import {
	CircleUser,
	CogIcon,
	GaugeIcon,
	LayoutTemplateIcon,
	LockIcon,
	MegaphoneIcon,
	Menu,
	NewspaperIcon,
	PlusIcon,
} from 'lucide-react';

const ACCOUNT_NAV_BUTTONS = [
	{
		label: 'New Listing',
		href: '/account/new-listing',
		icon: PlusIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_LISTING,
	},
	{
		label: 'New Post',
		href: '/account/new-post',
		icon: PlusIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_BLOG_POST,
	},
];

const ACCOUNT_NAV_LINKS = [
	{
		label: 'Dashboard',
		href: '/account',
		icon: GaugeIcon,
		needSuperAdmin: false,
		neededRolePermission: null,
	},
	{
		label: 'Listings',
		href: '/account/listings',
		icon: LayoutTemplateIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_LISTING,
	},
	{
		label: 'Products',
		href: '/account/sublistings',
		icon: LayoutTemplateIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_SUBLISTING,
	},
	{
		label: 'Posts',
		href: '/account/posts',
		icon: NewspaperIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_BLOG_POST,
	},
	{
		label: 'Promotions',
		href: '/account/promotions',
		icon: MegaphoneIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_PROMOTIONS,
	},
	{
		label: 'Settings',
		href: '/account/settings',
		icon: CogIcon,
		needSuperAdmin: false,
		neededRolePermission: Permissions.MANAGE_ACCOUNT_SETTINGS,
	},
	{
		label: 'Admin',
		href: '/secret-admin',
		icon: LockIcon,
		needSuperAdmin: true,
		neededRolePermission: null,
	},
];

function Navbar_Skeleton() {
	return (
		<div className="w-full border-b">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo placeholder */}
					<div className="flex items-center">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-4 w-24 ml-2" />
					</div>

					{/* Navigation items placeholder */}
					<div className="hidden md:flex items-center space-x-4">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
					</div>

					{/* Action buttons placeholder */}
					<div className="flex items-center space-x-2">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-8 w-20" />
					</div>

					{/* Mobile menu button placeholder */}
					<div className="md:hidden">
						<Skeleton className="h-8 w-8" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * A header component that displays links to account pages.
 */
export default function Navbar_Protected() {
	const pathname = usePathname();
	const [user, setUser] = useState<AuthUserType | null>(null);

	const { userObject, isSuperAdmin } = useClientAuth({
		checkAdmin: true,
	});

	useEffect(() => {
		setUser(userObject);
	}, [userObject]);

	if (!user) {
		return <Navbar_Skeleton />;
	}

	return (
		<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
			<nav className="hidden flex-col gap-6 text-lg font-medium lg:flex lg:flex-row lg:items-center lg:gap-5 lg:text-sm">
				<Link href="/" className="h-8 w-8">
					<Image
						src="/icons/icon-192.png"
						alt={`${COMPANY_BASIC_INFORMATION.NAME} Icon`}
						width={192}
						height={192}
						className="h-8 w-8"
						priority
					/>
					<span className="sr-only">Icon</span>
				</Link>

				{ACCOUNT_NAV_LINKS.map((link) =>
					link.needSuperAdmin && !isSuperAdmin
						? null
						: (GENERAL_SETTINGS.USE_SUBLISTINGS ||
								(!GENERAL_SETTINGS.USE_SUBLISTINGS &&
									link.label !== 'Products')) &&
						  (link.neededRolePermission === null
								? true
								: userHasPermission(
										user.role as Roles,
										link.neededRolePermission
								  )) && (
								<Link
									key={link.label}
									href={link.href}
									className={cn(
										'text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 p-3 transition-all',
										link.href === pathname ? 'text-foreground bg-muted' : ''
									)}
								>
									<link.icon className="h-5 w-5 hidden xl:flex" />
									{link.label}
								</Link>
						  )
				)}
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 lg:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col">
					<nav className="flex flex-col gap-2 text-lg font-medium">
						<div className="flex h-14 w-auto">
							<Link href="/">
								<Image
									src="/logos/logo_for_light.png"
									alt={`${COMPANY_BASIC_INFORMATION.NAME} Icon`}
									width={192}
									height={40}
									className="h-auto w-auto dark:hidden"
									priority
								/>
							</Link>
						</div>

						{ACCOUNT_NAV_LINKS.map((link) =>
							link.needSuperAdmin && !isSuperAdmin
								? null
								: (GENERAL_SETTINGS.USE_SUBLISTINGS ||
										(!GENERAL_SETTINGS.USE_SUBLISTINGS &&
											link.label !== 'Products')) &&
								  (link.neededRolePermission === null
										? true
										: userHasPermission(
												user.role as Roles,
												link.neededRolePermission as Permissions
										  )) && (
										<SheetClose asChild key={link.label}>
											<Link
												href={link.href}
												className={cn(
													'text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 p-3 transition-all',
													link.href === pathname
														? 'text-foreground bg-muted'
														: ''
												)}
											>
												<link.icon className="h-5 w-5" />
												{link.label}
											</Link>
										</SheetClose>
								  )
						)}
						<div className="absolute bottom-6 left-6">
							<form action="/api/auth/signout" method="post">
								<Button
									variant="outline"
									className="button block"
									type="submit"
								>
									Sign out
								</Button>
							</form>
						</div>
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
				{ACCOUNT_NAV_BUTTONS.map((button) =>
					button.neededRolePermission === null
						? true
						: userHasPermission(
								user.role as Roles,
								button.neededRolePermission
						  ) && (
								<Link
									key={button.label}
									href={button.href}
									className={cn(
										buttonVariants({ variant: 'outline', size: 'sm' })
									)}
								>
									{button.icon && <button.icon className="h-4 w-4" />}
									{button.label}
								</Link>
						  )
				)}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon" className="rounded-full">
							<CircleUser className="h-5 w-5" />
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-full">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link href="/account/settings">Settings</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<form action="/api/auth/signout" method="post">
							<Button variant="outline" className="mx-auto block" type="submit">
								Sign out
							</Button>
						</form>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
