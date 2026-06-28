'use client';

// Import Types
// Import External Packages
import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
// Import Components
import { buttonVariants } from '@/ui/Button';
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

export const NAVBAR_ADD_LINKS = [
	{
		name: 'Listings',
		href: '/explore',
	},
	{
		name: 'Products',
		href: '/products',
	},
	{
		name: 'Advertise',
		href: '/advertise',
	},
	{
		name: 'Blog',
		href: '/blog',
	},
];

/**
 * Renders a mode toggle button that allows the user to switch between light and dark mode.
 * If you want to use this component somewhere else, extract it to a separate file and import it.
 */
function ModeToggle() {
	function disableTransitionsTemporarily() {
		document.documentElement.classList.add('[&_*]:!transition-none');
		window.setTimeout(() => {
			document.documentElement.classList.remove('[&_*]:!transition-none');
		}, 0);
	}

	function toggleMode() {
		disableTransitionsTemporarily();

		const darkModeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)'
		);
		const isSystemDarkMode = darkModeMediaQuery.matches;
		const isDarkMode = document.documentElement.classList.toggle('dark');

		if (isDarkMode === isSystemDarkMode) {
			delete window.localStorage.isDarkMode;
		} else {
			window.localStorage.isDarkMode = isDarkMode;
		}
	}

	return (
		<button
			type="button"
			aria-label="Toggle dark mode"
			className="group rounded-full px-3 py-2"
			onClick={toggleMode}
		>
			<SunIcon className="h-6 w-6 fill-amber-200 stroke-amber-300 transition group-hover:hidden group-hover:dark:block dark:hidden " />
			<MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-400 group-hover:block group-hover:dark:hidden transition dark:block" />
		</button>
	);
}

export default function Navbar_Public() {
	return (
		<Disclosure
			as="nav"
			className="w-full sticky top-0 z-50 bg-background/70 dark:bg-[#0b1120]/80 backdrop-blur-xl border-b border-border/50 px-4 xl:px-0 h-[64px] flex items-center transition-all duration-300"
		>
			{({ open }) => (
				<div className="w-full">
					<div className="w-full max-w-7xl mx-auto h-full flex justify-between items-center">
						{/* Logo */}
						<div className="flex items-center z-20">
							<Link href="/">
								<Image
									src="/logos/logo_for_light.png"
									alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo`}
									width={140}
									height={40}
									className="h-8 w-auto dark:hidden"
									priority
								/>
								<Image
									src="/logos/logo_for_dark.png"
									alt={`${COMPANY_BASIC_INFORMATION.NAME} Logo Dark`}
									width={140}
									height={40}
									className="h-8 w-auto hidden dark:inline"
									priority
								/>
							</Link>
						</div>

						{/* Desktop Navigation Centered */}
						<div className="hidden lg:flex items-center justify-center gap-x-8 absolute left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none">
							<div className="pointer-events-auto flex items-center gap-x-8">
								{NAVBAR_ADD_LINKS.map(
									(link) =>
										(GENERAL_SETTINGS.USE_SUBLISTINGS ||
											(!GENERAL_SETTINGS.USE_SUBLISTINGS &&
												link.name !== 'Products')) && (
											<Link
												key={link.name}
												href={link.href}
												className="text-sm font-medium text-text-secondary hover:text-foreground dark:text-gray-300 dark:hover:text-white transition-colors"
											>
												{link.name}
											</Link>
										)
								)}
							</div>
						</div>

						{/* Right section: Search + Actions */}
						<div className="flex items-center gap-3 z-20">
							<Searchbar
								placeholder="Search..."
								className="hidden md:block w-48 lg:w-64 h-9"
								id="nav_search"
								rootPage="/explore"
							/>
							<Link
								href="/propose"
								className={cn(
									buttonVariants({ variant: 'default', size: 'sm' }),
									'hidden sm:flex rounded-full px-5 py-2 font-medium shadow-sm hover:shadow-md transition-all h-9'
								)}
								prefetch={false}
							>
								Submit
							</Link>
							<div className="flex items-center gap-1 border-l pl-3 ml-1 border-border">
								<ModeToggle />
								{GENERAL_SETTINGS.USE_PUBLISH && (
									<Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors p-2">
										<UserCircleIcon size={22} />
									</Link>
								)}
							</div>

							{/* Mobile menu button */}
							<div className="flex lg:hidden ml-1">
								<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-foreground focus:outline-none">
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<MenuIcon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					{/* Mobile menu */}
					<Disclosure.Panel className="lg:hidden absolute top-[64px] left-0 w-full bg-background/95 dark:bg-[#0b1120]/95 backdrop-blur-xl border-b border-border/50 shadow-lg z-40">
						{({ close }) => (
							<div className="space-y-1 px-4 pb-4 pt-2">
								<div className="pb-4">
									<Searchbar
										placeholder="Search..."
										className="w-full"
										id="nav_search_mobile"
										rootPage="/explore"
									/>
								</div>
								{NAVBAR_ADD_LINKS.map((link) => (
									<Disclosure.Button key={link.name} className="block w-full text-left">
										<Link
											href={link.href}
											className="hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground block rounded-md px-3 py-3 text-base font-medium"
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
												href="/propose"
												className="hover:bg-neutral-100 dark:hover:bg-neutral-800 text-accent block rounded-md px-3 py-3 text-base font-medium"
												onClick={() => close()}
											>
												Submit a listing
											</Link>
										</Disclosure.Button>
										<Disclosure.Button className="block w-full text-left">
											<Link
												href="/account"
												className="hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground block rounded-md px-3 py-3 text-base font-medium"
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
