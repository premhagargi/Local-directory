// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import Sidebar_Admin from '@/components/Sidebar_Admin';
import { Skeleton } from '@/ui/Skeleton';
// Import Functions & Actions & Hooks & State
// Import Data
import { Suspense } from 'react';
// Import Assets & Icons

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: `Admin`,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<main className="w-full max-w-7xl mx-auto gap-8 grid grid-cols-1 lg:grid-cols-5 sm:px-2 lg:px-6">
				<Suspense
					fallback={
						<div className="grid gap-4 my-12 grid-cols-1">
							<ComponentMultiplier
								component={<Skeleton className="w-full h-[20px] mx-auto" />}
								multiplier={14}
							/>
						</div>
					}
				>
					<Sidebar_Admin />
				</Suspense>
				<div className="col-span-4">
					<Suspense
						fallback={
							<div className="grid gap-4 my-12 grid-cols-5">
								<ComponentMultiplier
									component={<Skeleton className="w-full h-[20px] mx-auto" />}
									multiplier={14}
								/>
							</div>
						}
					>
						{children}
					</Suspense>
				</div>
			</main>
		</>
	);
}
