// Import Types
// Import External Packages
import { Suspense } from 'react';
import Image from 'next/image';
// Import Components
import Searchbar from '@/components/Searchbar';
import CategoryBar from '@/components/categories/CategoryBar';
// Import Functions & Actions & Hooks & State
import { backgroundPattern } from '@/lib/utils';
// Import Data
import { HERO_TITLE, HERO_SLOGAN } from '@/constants';
// Import Assets & Icons

export default function MainHero() {
	return (
		<div className="bg-black">
			<div className="w-full z-10 relative isolate overflow-hidden">
				<Image
					src="/img/hero_main.jpg"
					alt="Hero Image"
					className="absolute inset-0 -z-10 h-full w-full object-cover"
					width={1920}
					height={1080}
					priority
				/>
				<div
					className="text-center relative py-6 z-50 bg-black/30"
					style={{ backgroundImage: backgroundPattern('boxes-sm') }}
				>
					<div className="w-full h-fit p-6">
						<div className="space-y-2 justify-center mx-auto max-w-2xl">
							<h1 className="text-5xl sm:text-7xl flex flex-wrap justify-center gap-4 text-white font-black [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
								{HERO_TITLE}
							</h1>
							<p className="text-xl font-semibold text-white pt-4 [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
								{HERO_SLOGAN}
							</p>
							<Suspense fallback={null}>
								<Searchbar className="py-4" id="hero_search" />
							</Suspense>
							<CategoryBar
								text=""
								className="self-start"
								badgeClassName="bg-search-background hover:bg-dark-foreground hover:text-white"
								hrefPrefix="/category/"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
