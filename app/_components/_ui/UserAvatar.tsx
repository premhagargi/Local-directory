'use client';
// Import Types
import { useEffect, useState } from 'react';
// Import External Packages
// Import Components
import { AvatarImage } from '@/ui/Avatar';
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
// Import Assets & Icons

export default function UserAvatar({
	url,
	size,
}: {
	url: string | null;
	size: number;
}) {
	const supabase = createSupabaseBrowserClient();
	const [avatarUrl, setAvatarUrl] = useState<string | null>(
		'/img/placeholder.png'
	);

	useEffect(() => {
		async function downloadImage(path: string) {
			try {
				const { data, error } = await supabase.storage
					.from('avatars')
					.download(path);
				if (error) {
					throw error;
				}

				const url = URL.createObjectURL(data);
				setAvatarUrl(url);
			} catch (error) {
				console.error('Error downloading image: ', error);
			}
		}

		if (url) downloadImage(url);
	}, [url, supabase]);

	return avatarUrl ? (
		<AvatarImage
			width={size}
			height={size}
			src={avatarUrl}
			alt="Avatar"
			className="avatar image"
			style={{ height: size, width: size }}
		/>
	) : (
		<AvatarImage
			width={size}
			height={size}
			src={'/img/placeholder.png'}
			alt="Avatar"
			style={{ height: size, width: size }}
		/>
	);
}
