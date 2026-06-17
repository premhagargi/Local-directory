'use client';
// Import Types
import { useEffect, useState } from 'react';
import Image from 'next/image';
// Import External Packages
// Import Components
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
// Import Assets & Icons

export default function AvatarForm({
	uid,
	url,
	size,
	onUpload,
}: {
	uid: string | null;
	url: string | null;
	size: number;
	onUpload: (url: string) => void;
}) {
	const supabase = createSupabaseBrowserClient();
	const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
	const [uploading, setUploading] = useState(false);

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

	const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
		event
	) => {
		try {
			setUploading(true);

			if (!event.target.files || event.target.files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = event.target.files[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `${uid}-${Math.random()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(filePath, file);

			if (uploadError) {
				throw uploadError;
			}

			onUpload(filePath);
		} catch (error) {
			alert(
				'Error uploading image. File too big or wrong format. Only .png or .jpg!'
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			{avatarUrl ? (
				<Image
					width={size}
					height={size}
					src={avatarUrl}
					alt="Avatar"
					className="avatar image"
					style={{ height: size, width: size }}
				/>
			) : (
				<Image
					width={size}
					height={size}
					src={'/img/placeholder.png'}
					alt="Avatar"
					style={{ height: size, width: size }}
				/>
			)}

			<div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
				<Label htmlFor="picture">Picture</Label>
				<Input
					type="file"
					id="single"
					accept="image/*"
					onChange={uploadAvatar}
					disabled={uploading}
				/>
			</div>
		</div>
	);
}
