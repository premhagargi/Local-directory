'use client';

// Import External Packages
import { useEffect, useRef, useState } from 'react';
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Assets & Icons
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

/**
 * Horizontal scrolling screenshot gallery — AppStacks style.
 * Renders arrow navigation and a scroll-position track only when there's more than one image.
 */
export default function ListingGallery({
	images,
	alt,
}: {
	images: string[];
	alt: string;
}) {
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [thumb, setThumb] = useState({ left: 0, width: 100 });

	const updateScrollState = () => {
		const el = scrollerRef.current;
		if (!el) return;
		const { scrollLeft, scrollWidth, clientWidth } = el;
		const maxScroll = scrollWidth - clientWidth;
		setCanScrollLeft(scrollLeft > 4);
		setCanScrollRight(scrollLeft < maxScroll - 4);
		setThumb({
			left: maxScroll > 0 ? (scrollLeft / scrollWidth) * 100 : 0,
			width: (clientWidth / scrollWidth) * 100,
		});
	};

	useEffect(() => {
		updateScrollState();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images.length]);

	const scrollByPage = (direction: 1 | -1) => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
	};

	if (images.length === 0) return null;

	const multiple = images.length > 1;

	return (
		<div className="w-full">
			<div className="relative">
				<div
					ref={scrollerRef}
					onScroll={updateScrollState}
					className="w-full overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
					style={{ scrollbarWidth: 'none' }}
				>
					<div
						className="flex gap-3 px-4 sm:px-6 py-6"
						style={{ width: 'max-content' }}
					>
						{images.map((src, i) => (
							<div
								key={i}
								className="flex-shrink-0 rounded-[18px] overflow-hidden bg-neutral-200 dark:bg-neutral-800"
								style={{
									width: multiple ? '580px' : '760px',
									maxWidth: '85vw',
									height: '365px',
								}}
							>
								<SupabaseImage
									dbImageUrl={src}
									width={1160}
									height={730}
									database="listing_images"
									priority={i === 0}
									className="w-full h-full object-cover"
									imageAlt={`${alt} screenshot ${i + 1}`}
								/>
							</div>
						))}
					</div>
				</div>

				{multiple && canScrollLeft && (
					<button
						onClick={() => scrollByPage(-1)}
						aria-label="Scroll gallery left"
						className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-border shadow-md items-center justify-center text-foreground hover:bg-neutral-50 transition-colors"
					>
						<ChevronLeftIcon className="w-4 h-4" />
					</button>
				)}
				{multiple && canScrollRight && (
					<button
						onClick={() => scrollByPage(1)}
						aria-label="Scroll gallery right"
						className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-border shadow-md items-center justify-center text-foreground hover:bg-neutral-50 transition-colors"
					>
						<ChevronRightIcon className="w-4 h-4" />
					</button>
				)}
			</div>

			{multiple && (
				<div className="w-full px-4 sm:px-6">
					<div className="relative h-1 rounded-full bg-border/50 overflow-hidden">
						<div
							className={cn(
								'absolute top-0 h-full bg-foreground/30 rounded-full transition-[left] duration-150'
							)}
							style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
