// Import Types
import { Metadata } from 'next';
// Import External Packages
import { Suspense } from 'react';
// Import Components
import ComponentMultiplier from '@/ui/ComponentMultiplier';
import Navbar_Protected from '@/components/Navbar_Protected';
import { Skeleton } from '@/ui/Skeleton';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: `Account`,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen w-full flex-col bg-background-secondary px-2 lg:px-0">
			<Suspense
				fallback={
					<ComponentMultiplier
						component={<Skeleton className="w-full h-[40px]" />}
						multiplier={1}
					/>
				}
			>
				<Navbar_Protected />
			</Suspense>
			<main className="w-full max-w-7xl mx-auto py-12">
				<Suspense
					fallback={
						<div className="grid gap-4 my-12">
							<ComponentMultiplier
								component={<Skeleton className="w-full h-[20px] mx-auto" />}
								multiplier={14}
							/>
						</div>
					}
				>
					{children}
				</Suspense>
			</main>
		</div>
	);
}
