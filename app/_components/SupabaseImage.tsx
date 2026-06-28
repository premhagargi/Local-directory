'use client';
// Import Types
import { useEffect, useState } from 'react';
import Image from 'next/image';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { cn } from '@/utils';
// Import Data
import { DEFAULT_IMAGE_OPTIONS } from '@/constants';
// Import Assets & Icons

/**
 * Renders an image component that fetches and displays an image from a Supabase storage.
 *
 * @param dbImageUrl - The URL of the image in the Supabase storage.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @param database - The name of the Supabase storage database where the image is stored.
 * @param className - Optional. Additional CSS class name(s) for the image component.
 * @param imageAlt - Optional. The alt text for the image.
 * @returns The rendered image component.
 */
export default function SupabaseImage({
	dbImageUrl,
	width,
	height,
	database,
	className,
	imageAlt,
	priority,
}: {
	dbImageUrl: string | null;
	width: number;
	height: number;
	database:
		| 'avatars'
		| 'listing_images'
		| 'sublisting_images'
		| 'blog_images'
		| 'ad_images'
		| 'cattag_images';
	className?: string;
	imageAlt?: string;
	priority: boolean;
}) {
	const supabase = createSupabaseBrowserClient();
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (dbImageUrl) {
			const isLocalImage = DEFAULT_IMAGE_OPTIONS.find(
				(localImage) => localImage.nameInDB === dbImageUrl
			);
			if (isLocalImage) {
				setImageURL(isLocalImage.localHref);
			} else if (dbImageUrl.startsWith('http')) {
				// Handle dummy images and absolute URLs
				setImageURL(dbImageUrl);
			} else {
				// R2 public bucket path
				const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
				setImageURL(`${r2Url}/${dbImageUrl}`);
			}
		}
	}, [dbImageUrl, database]);

	return (
		<Image
			width={width}
			height={height}
			src={imageURL || '/img/placeholder.png'}
			alt={imageAlt || 'Cover Image'}
			className={cn(
				isLoading && 'animate-pulse',
				'object-cover bg-no-repeat h-auto w-full',
				className
			)}
			placeholder="blur"
			blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
			priority={priority}
		/>
	);
}
