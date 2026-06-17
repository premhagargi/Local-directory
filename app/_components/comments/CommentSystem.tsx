'use client';

// Import Types
import { Tables } from '@/supabase-types';
type Author = {
	username: string | null;
	avatar_url: string | null;
} | null;
type CommentType = Tables<'comments'> & { author: Author };
// Import External Packages
import { useState } from 'react';
import Link from 'next/link';
// Import Components
import { Avatar, AvatarFallback } from '@/ui/Avatar';
import UserAvatar from '@/ui/UserAvatar';
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import insertActivity from '@/actions/activites/insertActivity';
import upsertComment from '@/actions/comments/upsertComment';
import { AvatarImage } from '@/ui/Avatar';
import useClientAuth from '@/lib/useClientAuth';
import { formatPassedTime } from '@/lib/utils';
import { toast } from '@/lib/useToaster';
// Import Data
// Import Assets & Icons

function Comment({
	commentObject,
	replies,
	isReply = false,
	handleReply,
}: {
	commentObject: CommentType;
	replies?: CommentType[];
	isReply?: boolean;
	handleReply: (comment: CommentType) => void;
}) {
	return (
		<div className={isReply ? 'pl-14 py-2 w-full' : ''}>
			<div className="flex items-start gap-4">
				<Avatar className="w-10 h-10 border">
					{commentObject.author?.avatar_url ? (
						<UserAvatar url={commentObject.author?.avatar_url} size={44} />
					) : (
						<AvatarFallback>{commentObject.author?.username}</AvatarFallback>
					)}
				</Avatar>
				<div className="space-y-2 w-full">
					<div className="flex items-center justify-between">
						{!!commentObject.author?.username ? (
							<Link
								className="font-medium"
								href={`/user/${commentObject.author?.username}`}
								prefetch={false}
							>
								{commentObject.author?.username}
							</Link>
						) : (
							<span className="font-medium text-foreground">Anonymous</span>
						)}

						<time className="text-sm text-gray-500 dark:text-gray-400">
							{formatPassedTime(commentObject.created_at)}
						</time>
					</div>
					<p className="text-gray-500 dark:text-gray-400">
						{commentObject.content}
					</p>
					{!isReply && (
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleReply(commentObject)}
								className="text-muted-foreground"
							>
								Reply to this comment
								<span className="sr-only">Reply</span>
							</Button>
						</div>
					)}
				</div>
			</div>

			{replies &&
				replies.map((reply) => (
					<Comment
						key={reply.id}
						commentObject={reply}
						handleReply={handleReply}
						isReply
					/>
				))}
		</div>
	);
}

export default function CommentSystem({
	comments,
	blog_or_listing_id,
	blog_or_listing,
}: {
	comments: CommentType[];
	blog_or_listing_id: string;
	blog_or_listing: 'blog_post_id' | 'listing_id' | 'sublisting_id';
}) {
	const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
	const [disabledSubmit, setDisabledSubmit] = useState(false);
	const [commentContent, setCommentContent] = useState('');
	const maxLength = 1000;

	const { userObject: user } = useClientAuth({});

	const handleComment = async () => {
		const newComment = await upsertComment({
			content: commentContent,
			parent_comment_id: replyingTo?.id,
			blog_or_listing_id: blog_or_listing_id,
			blog_or_listing: blog_or_listing,
		});
		if (newComment.success) {
			setDisabledSubmit(true);
			setCommentContent('');
			setReplyingTo(null);
			toast({
				title: 'Success',
				description: `Your comment has been created! It will now be reviewed by our team.`,
			});
			await insertActivity('new_comment', commentContent);
		} else {
			console.error(newComment.errors);
			toast({
				title: 'Error',
				description: `Your comment has not been created! There was an error! Please try again or contact support.`,
			});
		}
	};
	const handleCancelReply = () => {
		setReplyingTo(null);
	};

	return (
		<div className="mx-auto w-full space-y-6">
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Comments</h2>
				<div className="space-y-4">
					{comments.length === 0 && (
						<p className="text-muted-foreground">
							No comments yet. Be the first to write a comment!
						</p>
					)}
					{comments.map(
						(comment) =>
							!!!comment.parent_comment_id && (
								<Comment
									key={comment.id}
									commentObject={comment}
									handleReply={setReplyingTo}
									replies={comments.filter(
										(c) => c.parent_comment_id === comment.id
									)}
								/>
							)
					)}
				</div>
			</div>

			<div className="space-y-2">
				<>
					<h3 className="text-xl font-bold">Add a Comment</h3>
					{replyingTo && (
						<div className="pl-14">
							<span className="text-muted-foreground">
								You are replying to {replyingTo.author?.username}:{' '}
								{replyingTo.content}
							</span>
						</div>
					)}

					<div className="flex items-start gap-4">
						<Avatar className="w-10 h-10 border">
							{user && user.avatar_url ? (
								<UserAvatar url={user.avatar_url} size={44} />
							) : (
								<AvatarImage src="/img/placeholder.png" />
							)}

							<AvatarFallback>YOU</AvatarFallback>
						</Avatar>

						<div className="flex-1">
							<Textarea
								placeholder="Write your comment here..."
								className="resize-none min-h-[100px]"
								value={commentContent}
								onChange={(e) => setCommentContent(e.target.value)}
								maxLength={maxLength}
							/>

							<div className="flex justify-end mt-2 items-center gap-x-4">
								{!user && (
									<p className="text-xs italic text-muted-foreground">
										Sign in to write a comment!
									</p>
								)}
								<span className="text-xs italic text-muted-foreground">
									{commentContent.length}/{maxLength}
								</span>
								{replyingTo && (
									<Button onClick={handleCancelReply} variant="secondary">
										Cancel
									</Button>
								)}

								<Button
									onClick={handleComment}
									className="ml-2"
									variant="outline"
									disabled={!user || disabledSubmit}
								>
									Submit
								</Button>
							</div>
						</div>
					</div>
				</>
			</div>
		</div>
	);
}
