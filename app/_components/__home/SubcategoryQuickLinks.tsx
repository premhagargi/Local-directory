// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
import {
	SubSectionContentContainer,
	SubSectionDescription,
	SubSectionInnerContainer,
	SubSectionOuterContainer,
	SubSectionTitle,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import getFullSubcategories from '@/actions/subcategories/getFullSubcategories';
// Import Data
// Import Assets & Icons

export default async function SubategoryQuickLinks() {
	const { data: subcategoryData } = await getFullSubcategories('active');

	return (
		<SubSectionOuterContainer>
			<SubSectionInnerContainer>
				<SubSectionTitle>Trending Categories</SubSectionTitle>
				<SubSectionDescription>
					Find the best deals right now.
				</SubSectionDescription>

				<SubSectionContentContainer className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto">
					{subcategoryData.map(
						(subcategory, index) =>
							subcategory.image_url_small &&
							index < 4 && (
								<div key={subcategory.id} className="group relative">
									<SupabaseImage
										dbImageUrl={subcategory.image_url_small}
										width={400}
										height={400}
										database="cattag_images"
										priority={true}
										className="group-hover:scale-105 transition-transform duration-300 w-full h-auto"
									/>

									<Link
										href={`/products?subcategory=${subcategory.slug}`}
										className="absolute inset-0"
									>
										<span className="sr-only">
											Category {subcategory.slug} Link
										</span>
									</Link>

									<p className="text-lg font-medium leading-6 my-1 text-center">
										{subcategory.name}
									</p>
								</div>
							)
					)}
				</SubSectionContentContainer>
			</SubSectionInnerContainer>
		</SubSectionOuterContainer>
	);
}
