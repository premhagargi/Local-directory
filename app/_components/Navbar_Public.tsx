'use client';

// Import Types
// Import External Packages
import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Import Components
import Searchbar from '@/components/Searchbar';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import {
	MenuIcon,
	MoonIcon,
	XIcon,
	SunIcon,
	UserCircleIcon,
} from 'lucide-react';

// Primary navigation tabs (left side, next to logo) — matches AppStacks "Apps | Tools | Updates"
export const NAVBAR_PRIMARY_LINKS = [
	{ name: 'Explore', href: '/explore' },
	{ name: 'Products', href: '/products' },
	{ name: 'Advertise', href: '/advertise' },
	{ name: 'Blog', href: '/blog' },
];

export default function Navbar_Public() {
	const pathname = usePathname();

	return (
		<Disclosure
			as="nav"
			className="w-full sticky top-0 z-50 bg-background border-b-2 border-border h-[64px] flex items-center"
		>
			{({ open }) => (
				<div className="w-full px-4 sm:px-5">
					<div className="w-full flex items-center h-[64px]">

						{/* Logo */}
						<Link href="/" className="flex items-center gap-2 mr-5 flex-shrink-0">
							<Image
								src="/logos/logo_for_light.png"
								alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo`}
								width={120}
								height={36}
								className="h-6 w-auto dark:hidden"
								priority
							/>
							<Image
								src="/logos/logo_for_dark.png"
								alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo Dark`}
								width={120}
								height={36}
								className="h-6 w-auto hidden dark:inline"
								priority
							/>
						</Link>

						{/* Primary nav tabs — right next to logo, AppStacks style with bottom underline */}
						<div className="hidden lg:flex items-center h-[64px] flex-shrink-0">
							{NAVBAR_PRIMARY_LINKS.map((link) => {
								const isActive =
									pathname === link.href ||
									(link.href !== '/' && pathname.startsWith(link.href));
								return (
									<Link
										key={link.name}
										href={link.href}
										className={cn(
											'relative flex items-center h-full px-3.5 text-[14px] font-medium transition-colors',
											isActive
												? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-foreground'
												: 'text-text-secondary hover:text-foreground'
										)}
									>
										{link.name}
									</Link>
								);
							})}
						</div>

						{/* Spacer */}
						<div className="flex-1" />
						
						{/* Right side — utility links */}
						<div className="hidden lg:flex items-center gap-x-5">
							{GENERAL_SETTINGS.USE_PUBLISH && (
								<Link
									href="/account"
									className="text-text-secondary hover:text-foreground transition-colors p-1 rounded-full"
									title="Account"
								>
									<UserCircleIcon className="w-[18px] h-[18px]" />
								</Link>
							)}

							{/* Submit CTA */}
							<Link
								href="/propose"
								className="inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-semibold bg-foreground text-background hover:opacity-85 transition-opacity"
								prefetch={false}
							>
								Submit
							</Link>
						</div>

						{/* Mobile menu button */}
						<div className="flex lg:hidden ml-2">
							<Disclosure.Button className="inline-flex items-center justify-center rounded-full p-1.5 text-text-secondary hover:text-foreground hover:bg-black/5 focus:outline-none transition-colors">
								<span className="sr-only">Open main menu</span>
								{open ? (
									<XIcon className="block h-5 w-5" aria-hidden="true" />
								) : (
									<MenuIcon className="block h-5 w-5" aria-hidden="true" />
								)}
							</Disclosure.Button>
						</div>
					</div>

					{/* Mobile Menu */}
					<Disclosure.Panel className="lg:hidden absolute top-[64px] left-0 w-full bg-background border-b border-border shadow-sm z-40">
						{({ close }) => (
							<div className="px-4 py-4 space-y-1">
								<div className="pb-3 border-b border-border/50 mb-3">
									<Searchbar
										placeholder="Search..."
										className="w-full"
										id="nav_search_mobile"
										rootPage="/explore"
									/>
								</div>
								{NAVBAR_PRIMARY_LINKS.map((link) => (
									<Disclosure.Button key={link.name} className="block w-full text-left">
										<Link
											href={link.href}
											className="flex items-center hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors"
											onClick={() => close()}
										>
											{link.name}
										</Link>
									</Disclosure.Button>
								))}
								{GENERAL_SETTINGS.USE_PUBLISH && (
									<>
										<Disclosure.Button className="block w-full text-left">
											<Link
												href="/account"
												className="flex items-center hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors"
												onClick={() => close()}
											>
												Account
											</Link>
										</Disclosure.Button>
									</>
								)}
							</div>
						)}
					</Disclosure.Panel>
				</div>
			)}
		</Disclosure>
	);
}
