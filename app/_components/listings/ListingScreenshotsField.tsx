'use client';

// Import External Packages
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
import SupabaseImageUploadArea from '@/components/SupabaseImageUploadArea';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons
import { XIcon } from 'lucide-react';

/**
 * Manages a list of extra listing screenshots — shown in the gallery on the detail page.
 * @param uid - The unique identifier of the user (used for storage pathing).
 * @param urls - The currently saved screenshot URLs.
 * @param onChange - Called with the full updated array whenever a screenshot is added or removed.
 */
export default function ListingScreenshotsField({
	uid,
	urls,
	onChange,
}: {
	uid: string | null;
	urls: string[];
	onChange: (urls: string[]) => void;
}) {
	return (
		<div className="space-y-3">
			{urls.length > 0 && (
				<div className="flex flex-wrap gap-3">
					{urls.map((url, index) => (
						<div
							key={`${url}-${index}`}
							className="relative w-40 aspect-[397/264] rounded-[10px] overflow-hidden border border-border bg-neutral-100 dark:bg-neutral-800"
						>
							<SupabaseImage
								dbImageUrl={url}
								width={397}
								height={264}
								database="listing_images"
								className="w-full h-full object-cover"
								imageAlt={`Screenshot ${index + 1}`}
							/>
							<button
								type="button"
								onClick={() => onChange(urls.filter((_, i) => i !== index))}
								className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
							>
								<XIcon className="w-3.5 h-3.5" />
								<span className="sr-only">Remove screenshot</span>
							</button>
						</div>
					))}
				</div>
			)}

			{/* Remounts after every add so the file input resets cleanly */}
			<SupabaseImageUploadArea
				key={urls.length}
				uid={uid}
				url={null}
				width={397}
				height={264}
				database="listing_images"
				onUpload={(url) => onChange([...urls, url])}
			/>
		</div>
	);
}
