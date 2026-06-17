// Import Types
import { FullCategoryType } from '@/supabase-special-types';
// Import External Packages
import Image from 'next/image';
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

/**
 * A hero component that displays information about a category.
 * @param category - The category to display.
 */
export default function CategoryHero({
	category,
}: {
	category: FullCategoryType;
}) {
	return (
		<div className="rounded-xl bg-black">
			<div
				className="w-full z-10 relative isolate overflow-hidden rounded-md h-96 bg-white dark:bg-black"
				style={{ backgroundColor: category.color ? category.color : undefined }}
			>
				{category.image_url_hero ? (
					<SupabaseImage
						dbImageUrl={category.image_url_hero}
						imageAlt={category.description ? category.description : 'Tag Image'}
						width={1200}
						height={630}
						className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
						database="cattag_images"
						priority
					/>
				) : category.color ? null : (
					<Image
						src="/img/hero_other.jpg"
						alt="Hero Image"
						className="absolute inset-0 -z-10 h-full w-full object-cover"
						width={1920}
						height={1080}
						priority
					/>
				)}

				<div className="text-center py-6 relative z-50 rounded-sm backdrop-blur-sm w-full h-full content-center">
					<div className="justify-center">
						<div className="flex justify-center pb-8">
							<div className="grid group relative w-full h-full items-center justify-center content-center">
								{!!category.emoji && (
									<span className="text-4xl">{category.emoji}</span>
								)}

								<span className="font-black text-7xl text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
									{category.name}
								</span>
							</div>
						</div>
						<div className="grid space-y-2 max-w-3xl mx-auto [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
							<h1 className="text-3xl font-semibold text-white">
								{category.headline}
							</h1>
							<p className="text-xl text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
								{category.description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
