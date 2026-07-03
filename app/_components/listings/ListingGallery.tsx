'use client';

// Import External Packages
import { useCallback, useEffect, useRef, useState } from 'react';
// Import Components
import SupabaseImage from '@/components/SupabaseImage';
// Import Functions & Actions & Hooks & State
// Import Assets & Icons

/**
 * Horizontal scrolling screenshot gallery — AppStacks style.
 * When there's more than one image, renders a real, draggable scrollbar below
 * the images (click the track to jump, drag the thumb to scroll). No arrows.
 */
export default function ListingGallery({
	images,
	alt,
}: {
	images: string[];
	alt: string;
}) {
	const scrollerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const draggingRef = useRef(false);
	const [thumb, setThumb] = useState({ left: 0, width: 100 });

	const updateThumb = useCallback(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const { scrollLeft, scrollWidth, clientWidth } = el;
		const maxScroll = scrollWidth - clientWidth;
		setThumb({
			left: maxScroll > 0 ? (scrollLeft / scrollWidth) * 100 : 0,
			width: (clientWidth / scrollWidth) * 100,
		});
	}, []);

	useEffect(() => {
		updateThumb();
		const onResize = () => updateThumb();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [images.length, updateThumb]);

	// Map a pointer X position on the track to a scroll offset (centres the thumb
	// under the pointer) — this is what makes the bar behave like a real scrollbar.
	const scrollToPointer = useCallback((clientX: number) => {
		const track = trackRef.current;
		const el = scrollerRef.current;
		if (!track || !el) return;
		const rect = track.getBoundingClientRect();
		const maxScroll = el.scrollWidth - el.clientWidth;
		if (maxScroll <= 0) return;
		const thumbWidthPx = (el.clientWidth / el.scrollWidth) * rect.width;
		const travel = rect.width - thumbWidthPx;
		if (travel <= 0) return;
		let thumbLeft = clientX - rect.left - thumbWidthPx / 2;
		thumbLeft = Math.max(0, Math.min(thumbLeft, travel));
		el.scrollLeft = (thumbLeft / travel) * maxScroll;
	}, []);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		draggingRef.current = true;
		trackRef.current?.setPointerCapture(e.pointerId);
		scrollToPointer(e.clientX);
	};
	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!draggingRef.current) return;
		scrollToPointer(e.clientX);
	};
	const stopDragging = (e: React.PointerEvent<HTMLDivElement>) => {
		draggingRef.current = false;
		trackRef.current?.releasePointerCapture(e.pointerId);
	};

	if (images.length === 0) return null;

	const multiple = images.length > 1;

	return (
		<div className="w-full">
			<div
				ref={scrollerRef}
				onScroll={updateThumb}
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
								width: multiple ? '763px' : '999px',
								maxWidth: '90vw',
								height: '480px',
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

			{multiple && (
				<div className="w-full px-4 sm:px-6 pb-2">
					{/* Real, draggable scrollbar (not just an indicator) */}
					<div
						ref={trackRef}
						onPointerDown={onPointerDown}
						onPointerMove={onPointerMove}
						onPointerUp={stopDragging}
						onPointerCancel={stopDragging}
						role="scrollbar"
						aria-label="Scroll gallery"
						aria-orientation="horizontal"
						className="group relative h-2 rounded-full bg-border/50 cursor-pointer touch-none select-none"
					>
						<div
							className="absolute top-0 h-full bg-foreground/40 group-hover:bg-foreground/60 rounded-full"
							style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
