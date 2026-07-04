// Import Types
// Import External Packages
import { Suspense } from 'react';
// Import Components
import { TagSearchBox } from '@/components/tags/TagSearchBox';
// Import Functions & Actions & Hooks & State
import getPartialCategories from '@/actions/categories/getPartialCategories';
import getPartialTags from '@/actions/tags/getPartialTags';
// Import Data
// Import Assets & Icons

/**
 * Left sidebar shared across the explore landing page and listing detail pages.
 * Full height, right border, fixed width — AppStacks exact.
 */
export default async function ExploreSidebar() {
	const tagData = await getPartialTags('active');
	const categoryData = await getPartialCategories('active');

	return (
		<aside className="hidden lg:flex flex-col flex-shrink-0 w-[260px] sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
			{/* Categories nav */}
			<div className="flex-1 py-6 px-3">
				<Suspense fallback={null}>
					<TagSearchBox
						tags={tagData.data}
						categories={categoryData.data}
						className="w-full max-w-none"
					/>
				</Suspense>
			</div>

			{/* Sidebar footer — AppStacks has attribution text at the bottom */}
			<div className="px-4 py-5 border-t border-border/40">
				<p className="text-[12px] text-text-secondary leading-relaxed">
					The ultimate resource directory.<br />
					Curated with ♥.
				</p>
				<p className="text-[12px] text-text-secondary mt-2">
					All rights reserved {new Date().getFullYear()}
				</p>
			</div>
		</aside>
	);
}
