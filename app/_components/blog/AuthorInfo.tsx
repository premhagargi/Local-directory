// Import Types
import { Tables } from '@/supabase-types';
// Import External Packages
// Import Components
import { Avatar, AvatarFallback } from '@/ui/Avatar';
import ExternalLink from '@/ui/ExternalLink';
import UserAvatar from '@/ui/UserAvatar';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

/**
 * A component that displays information about the author.
 */
export default function AuthorInfo({ author }: { author: Tables<'users'> }) {
	return (
		<div className="relative mx-auto pb-8">
			<h2 id="author" className="font-semibold text-sm dark:text-white">
				Author
			</h2>
			<div className="flex items-center gap-x-4 px-2">
				<Avatar className="w-12 h-12 rounded-full">
					<UserAvatar url={author.avatar_url} size={48} />
					<AvatarFallback>TK</AvatarFallback>
				</Avatar>
				<div className="text-sm leading-6 dark:text-white">
					<p className="font-semibold">
						{author.website ? (
							<ExternalLink className="underline" href={author.website}>
								<span className="absolute inset-0" />
								{author.full_name || author.username || 'Unknown'}
							</ExternalLink>
						) : (
							<span>{author.full_name || author.username || 'Unknown'}</span>
						)}
					</p>
					<p className="text-muted-foreground dark:text-white">
						{author.tag_line || ''}
					</p>
				</div>
			</div>
		</div>
	);
}
