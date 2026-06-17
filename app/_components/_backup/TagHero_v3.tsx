// Import Types
import { FullTagType } from '@/supabase-special-types';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

/**
 * A hero component that displays information about a tag.
 * @param tag - The tag to display.
 */
export default function TagHero({ tag }: { tag: FullTagType }) {
	return (
		<div className="w-full z-10 relative isolate overflow-hidden bg-white dark:bg-dark">
			<div className="relative z-50 rounded-sm w-full h-full">
				<div className="grid space-y-2">
					<p className="text-xl font-bold text-foreround">{tag.name}</p>

					<h1 className="text-3xl font-semibold text-foreround">
						{tag.headline}
					</h1>

					<p className="text-lg text-muted-foreground max-w-2xl">
						{tag.description}
					</p>
				</div>
			</div>
		</div>
	);
}
