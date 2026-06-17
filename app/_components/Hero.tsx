// Import Types
// Import External Packages
import Image from 'next/image';
// Import Components
// Import Functions & Actions & Hooks & State
import { backgroundPattern } from '@/lib/utils';
// Import Data
// Import Assets & Icons

/**
 * A hero component that displays a headline and description.
 * @param keyword - The keyword to display.
 * @param headline - The headline to display.
 * @param description - The description to display.
 */
export default function Hero({
	keyword = 'Explore',
	headline = 'Explore everything we have to offer',
	description = 'Find inspiration. Use the tags to filter and sort through our listings.',
}: {
	keyword?: string;
	headline?: string;
	description?: string;
}) {
	return (
		<div className="rounded-xl bg-black">
			<div className="w-full z-10 relative isolate overflow-hidden rounded-md h-96 bg-white dark:bg-black">
				<Image
					src="/img/hero_other.jpg"
					alt="Hero Image"
					className="absolute inset-0 -z-10 h-full w-full object-cover"
					width={1920}
					height={1080}
					priority
				/>
				<div
					className="text-center py-6 relative z-50 rounded-sm h-full"
					style={{ backgroundImage: backgroundPattern('boxes-sm') }}
				>
					<div className="grid h-full items-center">
						<span className="font-black text-7xl text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
							{keyword}
						</span>

						<div className="grid space-y-2 max-w-3xl mx-auto">
							<h1 className="text-3xl font-semibold text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
								{headline}
							</h1>
							<p className="text-xl text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]">
								{description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
