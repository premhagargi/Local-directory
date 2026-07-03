// Import Types
// Import External Packages
import { Suspense } from 'react';
// Import Components
import { SortDirectionBox } from '@/components/SortDirectionBox';
import ListingOverview from '@/components/listings/ListingOverview';
import { TagSearchBoxMobile } from '@/components/tags/TagSearchBox';
import ExploreSidebar from '@/components/ExploreSidebar';
import Footer from '@/components/Footer';
import NewsletterBox_BeeHiiv from '@/components/NewsletterSection';
import Searchbar from '@/components/Searchbar';
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
		<div className="w-full bg-background min-h-screen flex flex-col">

			{/* Full-width layout: sidebar + content side by side — AppStacks exact */}
			<div className="flex flex-1 min-h-0">

				{/* Left Sidebar — full height, right border, fixed width */}
				<ExploreSidebar />

				{/* Main Content */}
				<div className="flex-1 flex flex-col min-w-0">

					{/* Hero — centered in main area */}
					<div className="w-full pt-14 pb-12 text-center">
						<div className="max-w-2xl mx-auto px-6">
							<h1 className="text-[38px] sm:text-[44px] font-normal text-foreground tracking-tight leading-[1.12] mb-4 font-sans">
								{HERO_TITLE}
							</h1>
							<p className="text-[15px] text-text-secondary leading-relaxed mb-8 max-w-[500px] mx-auto">
								{HERO_SLOGAN}
							</p>
							<div className="flex justify-center">
								<a
									href="/explore"
									className="inline-flex items-center bg-foreground text-background font-semibold px-6 py-2.5 rounded-full text-[14px] hover:opacity-85 transition-opacity"
								>
									Browse all apps
								</a>
							</div>
						</div>
					</div>

					{/* Listings grid area */}
					<div className="flex-1 px-4 sm:px-5 pt-5 pb-8">
						{/* Mobile filter + sort bar */}
						<div className="flex flex-wrap sm:flex-nowrap items-center mb-5 gap-3 justify-start">
							<Suspense fallback={null}>
								<TagSearchBoxMobile
									tags={tagData.data}
									categories={categoryData.data}
									className="lg:hidden"
								/>
							</Suspense>
							
							<div className="flex-1 max-w-sm hidden sm:block">
								<Searchbar
									placeholder="Search..."
									className="w-full bg-background rounded-[9px] border border-border text-[13px] shadow-sm"
									id="main_search"
								/>
							</div>
							<div className="flex-shrink-0">
								<Suspense fallback={null}>
									<SortDirectionBox />
								</Suspense>
							</div>
						</div>

						{/* Mobile Search - shown only on very small screens */}
						<div className="sm:hidden mb-5">
							<Searchbar
								placeholder="Search..."
								className="w-full bg-background rounded-[9px] border border-border text-[13px] shadow-sm"
								id="mobile_search"
							/>
						</div>

						{/* Cards grid */}
						<Suspense fallback={
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 w-full">
								{Array.from({ length: 6 }, (_, i) => (
									<div key={i} className="flex flex-col gap-3 animate-pulse">
										<div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-[14px] aspect-[1.91/1]" />
										<div className="flex gap-2.5 items-center">
											<div className="w-9 h-9 rounded-[9px] bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
											<div className="flex flex-col gap-1.5 flex-grow">
												<div className="h-3.5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-3/4" />
												<div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full w-1/2" />
											</div>
										</div>
									</div>
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
								className="py-0 md:py-0 px-0 xl:px-0 w-full"
							/>
						</Suspense>
					</div>

					{/* Newsletter */}
					<NewsletterBox_BeeHiiv className="border-t border-border/40" />

					{/* Footer */}
					<Footer />
				</div>
			</div>
		</div>
	);
}
