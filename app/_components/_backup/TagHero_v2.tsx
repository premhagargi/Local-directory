// Import Types
import { FullTagType } from '@/supabase-special-types';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

/**
 * A hero component that displays information about a tag.
 * @param tag - The tag to display.
 */
export default function TagHero({ tag }: { tag: FullTagType }) {
	return (
		<div className="rounded-xl bg-black">
			<div
				className="w-full z-10 relative isolate overflow-hidden rounded-md bg-black dark:bg-white"
				style={{ backgroundColor: tag.color ? tag.color : undefined }}
			>
				<div className="p-6 relative z-50 rounded-sm w-full h-full">
					<div className="grid space-y-2">
						{tag.emoji && (
							<div className="group relative w-full h-full flex items-center">
								<span
									className={cn(
										'text-white text-4xl',
										!tag.color && '[text-shadow:0_4px_12px_rgba(0,0,0,0.6)]'
									)}
								>
									{tag.emoji}
								</span>
							</div>
						)}
						<p
							className={cn(
								'text-xl font-bold text-white dark:text-black',
								!tag.color && '[text-shadow:0_4px_12px_rgba(0,0,0,0.6)]'
							)}
						>
							{tag.name}
						</p>

						<h1
							className={cn(
								'text-3xl font-semibold text-white dark:text-black',
								!tag.color && '[text-shadow:0_4px_12px_rgba(0,0,0,0.6)]'
							)}
						>
							{tag.headline}
						</h1>

						<p
							className={cn(
								'text-lg text-white dark:text-black',
								!tag.color && '[text-shadow:0_4px_12px_rgba(0,0,0,0.6)]'
							)}
						>
							{tag.description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
