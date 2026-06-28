// Import Types
// Import External Packages
import { Suspense } from 'react';
// Import Components
import { SortDirectionBox } from '@/components/SortDirectionBox';
import ListingOverview from '@/components/listings/ListingOverview';
import {
	TagSearchBox,
	TagSearchBoxMobile,
} from '@/components/tags/TagSearchBox';
import Navbar_Public from '@/components/Navbar_Public';
import Searchbar from '@/components/Searchbar';
import CategoryBar from '@/components/categories/CategoryBar';
// Import Functions & Actions & Hooks & State
import getPartialCategories from '@/actions/categories/getPartialCategories';
import getPartialTags from '@/actions/tags/getPartialTags';
// Import Data
import { HERO_TITLE, HERO_SLOGAN } from '@/constants';
// Import Assets & Icons

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const tagData = await getPartialTags('active');
	const categoryData = await getPartialCategories('active');

	return (
		<>
			<Navbar_Public />

			<div className="w-full bg-background min-h-screen">
				{/* Compact Hero - AppStacks style */}
				<div className="w-full pt-20 pb-16 text-center">
					<div className="max-w-2xl mx-auto px-4">
						<h1 className="text-4xl sm:text-5xl md:text-[44px] font-medium text-foreground tracking-tight leading-[1.15] mb-5 font-sans">
							Discover stories and stacks<br />behind your favorite apps
						</h1>
						<p className="text-base text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto">
							Learn what makes your favorite apps so special - from their origin
							story to their tech stack and the tools their teams rely on daily. Build
							smarter by learning from the best.
						</p>
						<div className="flex justify-center">
							<button className="bg-foreground text-background font-semibold px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity">
								Subscribe for free
							</button>
						</div>
					</div>
				</div>

				{/* Main Content: Sidebar + Grid */}
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
					<div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-8 items-start">
						{/* Sidebar */}
						<Suspense fallback={null}>
							<TagSearchBox
								tags={tagData.data}
								categories={categoryData.data}
								className="hidden lg:block sticky top-[88px] w-full"
							/>
						</Suspense>

						{/* Listings Grid */}
						<div className="flex-grow w-full min-w-0">
							<div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-6">
								<h2 className="text-xl font-semibold text-foreground">
									{/* Empty or can put a title here */}
								</h2>
								<div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
									<TagSearchBoxMobile
										tags={tagData.data}
										categories={categoryData.data}
										className="lg:hidden"
									/>
									<Suspense fallback={null}>
										<SortDirectionBox />
									</Suspense>
								</div>
							</div>
							<Suspense fallback={
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
									{Array.from({ length: 6 }, (_, i) => (
										<div key={i} className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-2xl aspect-[4/3]" />
									))}
								</div>
							}>
								<ListingOverview
									categoryNavigation={false}
									filterAndSortParams={searchParams || {}}
									maxNumListings={1000}
									maxCols={3}
									preferPromoted
									itemsPerPage={12}
									showSearch={false}
									className="py-0 md:py-0 w-full"
								/>
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
