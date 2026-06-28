// Import Types
// Import External Packages
import { Suspense } from 'react';
// Import Components
import Searchbar from '@/components/Searchbar';
import CategoryBar from '@/components/categories/CategoryBar';
// Import Functions & Actions & Hooks & State
// Import Data
import { HERO_TITLE, HERO_SLOGAN } from '@/constants';
// Import Assets & Icons

export default function MainHero() {
	return (
		<div className="bg-background w-full py-16 md:py-24 xl:py-32 border-b border-border">
			<div className="max-w-[900px] mx-auto px-4 text-center">
				<h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight mb-6">
					{HERO_TITLE}
				</h1>
				<p className="text-lg md:text-xl text-text-secondary font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
					{HERO_SLOGAN}
				</p>
				
				<div className="max-w-xl mx-auto mb-8 shadow-sm rounded-full bg-white">
					<Suspense fallback={null}>
						<Searchbar className="py-2" id="hero_search" rootPage="/explore" />
					</Suspense>
				</div>
				
				<div className="flex flex-col items-center gap-y-4">
					<CategoryBar
						text=""
						className="justify-center"
						badgeClassName="bg-white border border-border text-text-secondary hover:text-foreground hover:border-neutral-300 shadow-sm"
						hrefPrefix="/category/"
					/>
				</div>

				<div className="mt-16 pt-10 border-t border-border flex flex-col items-center">
					<p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
						Trusted by innovative teams worldwide
					</p>
					<div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale transition-all duration-300">
						<div className="font-heading font-bold text-xl text-muted-foreground">Acme Corp</div>
						<div className="font-heading font-bold text-xl text-muted-foreground">Globex</div>
						<div className="font-heading font-bold text-xl text-muted-foreground">Soylent</div>
						<div className="font-heading font-bold text-xl text-muted-foreground">Initech</div>
						<div className="font-heading font-bold text-xl text-muted-foreground">Massive Dynamic</div>
					</div>
				</div>
			</div>
		</div>
	);
}
