'use client';
// Import Types
// Import External Packages
import { useCallback, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
// Import Components
import AvatarForm from './AvatarForm';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import updateProfile from '@/actions/users/updateProfile';
// Import Data
// Import Assets & Icons

export default function AccountForm({ userId }: { userId: string }) {
	const [loading, setLoading] = useState(true);
	const [state, formAction] = useFormState(updateProfile, undefined);
	const [full_name, setfull_name] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [website, setWebsite] = useState<string | null>(null);
	const [avatar_url, setAvatarUrl] = useState<string | null>(null);
	const [tagLine, setTagLine] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);

	const supabase = createSupabaseBrowserClient();

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			if (!userId) throw new Error('User not found');

			const { data, error, status } = await supabase
				.from('users')
				.select(`full_name, username, website, avatar_url, tag_line, email`)
				.eq('id', userId)
				.maybeSingle();

			if (error && status !== 406) {
				console.error(error);
				throw error;
			}

			if (data) {
				setfull_name(data.full_name);
				setUsername(data.username);
				setWebsite(data.website);
				setAvatarUrl(data.avatar_url);
				setTagLine(data.tag_line);
				setEmail(data.email);
			}
		} catch (error) {
			alert('Error loading user data!');
		} finally {
			setLoading(false);
		}
	}, [userId, supabase]);

	useEffect(() => {
		getProfile();
	}, [userId, getProfile]);

	return (
		<div className="w-full">
			<form action={formAction}>
				<div className="grid gap-4">
					<AvatarForm
						uid={userId ?? null}
						url={avatar_url}
						size={150}
						onUpload={(url: string) => {
							setAvatarUrl(url);
						}}
					/>
					{!state?.success &&
						state?.errors?.avatar_url &&
						state?.errors?.avatar_url.length > 0 && (
							<div className="text-red-500 text-xs">
								<p>Avatar must:</p>
								<ul>
									{state.errors.avatar_url.map((error) => (
										<li key={error}>- {error}</li>
									))}
								</ul>
							</div>
						)}
					<div className="gap-2 hidden">
						<Label htmlFor="avatar_url">Avatar URL</Label>
						<Input
							id="avatar_url"
							type="hidden"
							name="avatar_url"
							placeholder="url"
							value={avatar_url || ''}
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="you@example.com"
							value={email || ''}
							disabled
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="full_name">Full Name</Label>
						<Input
							id="full_name"
							placeholder="Your Name"
							name="full_name"
							type="text"
							defaultValue={full_name || ''}
						/>
						{!state?.success &&
							state?.errors?.full_name &&
							state?.errors?.full_name?.length > 0 && (
								<div className="text-red-500 text-xs">
									<p>Full Name must:</p>
									<ul>
										{state.errors.full_name.map((error) => (
											<li key={error}>- {error}</li>
										))}
									</ul>
								</div>
							)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="username">User Name</Label>
						<Input
							id="username"
							name="username"
							placeholder="hunter2"
							type="text"
							defaultValue={username || ''}
						/>
						{!state?.success &&
							state?.errors?.username &&
							state?.errors?.username.length > 0 && (
								<div className="text-red-500 text-xs">
									<p>User Name must:</p>
									<ul>
										{state.errors.username.map((error) => (
											<li key={error}>- {error}</li>
										))}
									</ul>
								</div>
							)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="website">Website Link (e.g. social)</Label>
						<Input
							id="website"
							name="website"
							placeholder="https://example.com"
							type="text"
							defaultValue={website || ''}
						/>
						{!state?.success &&
							state?.errors?.website &&
							state?.errors?.website.length > 0 && (
								<div className="text-red-500 text-xs">
									<p>Website must:</p>
									<ul>
										{state.errors.website.map((error) => (
											<li key={error}>- {error}</li>
										))}
									</ul>
								</div>
							)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="tag_line">Tag Line (e.g. Never Stop!)</Label>
						<Input
							id="tag_line"
							name="tag_line"
							placeholder="Never Stop!"
							type="text"
							defaultValue={tagLine || ''}
						/>
						{!state?.success &&
							state?.errors?.tag_line &&
							state?.errors?.tag_line.length > 0 && (
								<div className="text-red-500 text-xs">
									<p>Tag Line must:</p>
									<ul>
										{state.errors.tag_line.map((error) => (
											<li key={error}>- {error}</li>
										))}
									</ul>
								</div>
							)}
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={loading || state?.success}
					>
						{state?.success
							? 'Your profile has been updated!'
							: loading
							? 'Loading ...'
							: 'Update'}
					</Button>
				</div>
			</form>
		</div>
	);
}
