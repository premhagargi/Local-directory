// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
import {
	SubSectionInnerContainer,
	SubSectionOuterContainer,
	SubSectionTitle,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import { getCategoriesWithListingCount } from '@/actions/categories/getCategoryStats';
// Import Data
// Import Assets & Icons
import { ArrowRightIcon } from 'lucide-react';

export default async function CategoryQuickLinks() {
	const { data: categoryData } = await getCategoriesWithListingCount();
	const totalListingCount = categoryData.reduce(
		(acc, category) => acc + category.listing_count,
		0
	);
	return (
		<SubSectionOuterContainer className="py-20">
			<SubSectionTitle className="mx-auto text-center">
				Browse all{' '}
				<span className="underline underline-offset-4 decoration-2 decoration-wavy decoration-primary/40">
					{totalListingCount}
				</span>{' '}
				Listings in{' '}
				<span className="underline underline-offset-4 decoration-2 decoration-wavy decoration-primary/40">
					{categoryData.length}{' '}
				</span>{' '}
				Categories
			</SubSectionTitle>
			<SubSectionInnerContainer>
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto mt-4">
					{categoryData.map((category) => (
						<div
							key={category.id}
							className="group flex flex-col no-underline transition-all rounded-md border border-neutral-300 dark:border-white"
						>
							<div className="relative flex justify-between items-center p-4">
								<div className="grid">
									<p className="text-2xl font-semibold leading-6 mb-2">
										{category.name}
									</p>
									<p className="text-sm text-foreground/80 dark:text-white/80 mt-2 line-clamp-2 sm:h-12">
										{category.headline}
									</p>
									<p className="text-sm text-foreground/80 dark:text-white/80 mt-2">
										<span className="font-bold">{category.listing_count}</span>{' '}
										{category.listing_count > 1 ? 'Listings' : 'Listing'}
									</p>
								</div>

								<ArrowRightIcon
									size={36}
									strokeWidth={4}
									className="group-hover:scale-150 duration-200 transition-all opacity-20 absolute right-2 bottom-2"
								/>
								<Link
									href={`/category/${category.slug}`}
									className="absolute inset-0"
								>
									<span className="sr-only">Category {category.slug} Link</span>
								</Link>
							</div>
						</div>
					))}
				</div>
			</SubSectionInnerContainer>
		</SubSectionOuterContainer>
	);
}
