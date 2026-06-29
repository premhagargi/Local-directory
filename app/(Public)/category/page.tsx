// Import Types
import { Metadata } from 'next';
// Import External Packages
import Link from 'next/link';
// Import Components
import Footer from '@/components/Footer';
// Import Functions & Actions & Hooks & State
import getFullCategories from '@/actions/categories/getFullCategories';
import createMetaData from '@/lib/createMetaData';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

export const metadata: Metadata = createMetaData({
	customTitle: 'Categories',
	customDescription: `See all categories used on ${COMPANY_BASIC_INFORMATION.NAME}. Quickly find what you are looking for by clicking on a category. Categories are used to categorize and filter listings.`,
	customSlug: `category`,
});

export default async function Page() {
	const { data: categoryData } = await getFullCategories('active');

	return (
		<div className="w-full bg-background min-h-screen">
			{/* Page header */}
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="mb-10">
					<h1 className="text-[32px] font-bold text-foreground tracking-tight mb-2">
						Browse Categories
					</h1>
					<p className="text-[15px] text-text-secondary max-w-xl leading-relaxed">
						Categories are used to group and filter listings. Click any category to explore apps in that space.
					</p>
				</div>

				{/* Category grid — card-based design */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{categoryData.map((category) => (
						<Link
							key={category.id}
							href={`/category/${category.slug}`}
							className="group flex flex-col p-6 bg-white dark:bg-card rounded-[16px] border border-border/50 hover:border-border hover:shadow-sm transition-all duration-200"
						>
							<div className="flex items-center gap-3 mb-3">
								{category.emoji && (
									<span className="text-2xl">{category.emoji}</span>
								)}
								<h2 className="text-[16px] font-bold text-foreground group-hover:text-foreground transition-colors">
									{category.name}
								</h2>
							</div>
							{category.description && (
								<p className="text-[14px] text-text-secondary leading-relaxed line-clamp-2">
									{category.description}
								</p>
							)}
							<div className="mt-4 text-[13px] font-medium text-text-secondary group-hover:text-foreground transition-colors">
								View listings →
							</div>
						</Link>
					))}
				</div>
			</div>

			<Footer />
		</div>
	);
}
