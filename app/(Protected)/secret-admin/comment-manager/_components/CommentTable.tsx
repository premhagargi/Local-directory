'use client';
// Import Types
import { FullCommentType } from '@/supabase-special-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import { Switch } from '@/components/_ui/Switch';
import Pagination from '@/ui/Pagination';
// Import Functions & Actions & Hooks & State
import approveComment_ADMIN from '@/actions/comments/approveComment_ADMIN';
import usePagination from '@/lib/usePagination';
import { toast } from '@/lib/useToaster';
import { Input } from '@/ui/Input';
// Import Data
// Import Assets & Icons

/**
 * A table component that displays comments.
 * @param comments - The comments to display.
 */
export default function CommentTable({
	comments,
}: {
	comments: FullCommentType[] | null;
}) {
	const [commentData, setCommentData] = useState<FullCommentType[]>(
		comments === null ? [] : comments
	);

	const {
		currentData,
		currentPage,
		totalPages,
		itemsPerPage,
		paginateBack,
		paginateFront,
		paginateBackFF,
		paginateFrontFF,
		setItemsPerPage,
		setSearchTerm,
	} = usePagination({
		initialItemsPerPage: 10,
		data: commentData,
		searchField: 'content',
	});

	const handleApproveToggle = async (
		changeComment: FullCommentType,
		newState: boolean
	) => {
		const updatedComments = commentData.map((comment) => {
			if (comment.id === changeComment.id) {
				comment.is_approved = newState;
			}
			return comment;
		});
		setCommentData(updatedComments);

		await approveComment_ADMIN({
			id: changeComment.id,
			is_approved: newState,
		}).then(() => {
			toast({
				title: `Success!`,
				description: `The comment has been ${
					newState ? 'approved' : 'disapproved'
				}.`,
			});
		});
	};

	return (
		<div>
			<div className="w-full flex justify-end">
				<Input
					className="w-58"
					placeholder="Search by name..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>

			<div className="grid">
				<div className="table table-auto w-full mt-6">
					<div className="table-header-group">
						<div className="table-row text-sm">
							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Author
							</div>

							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Location
							</div>

							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Comment
							</div>

							<div className="table-cell w-24 h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Approved
							</div>
						</div>
					</div>
					<div className="table-row-group">
						{currentData.map((comment) => (
							<div key={comment.id} className="table-row h-auto">
								<div className="hidden sm:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
									{comment.author?.username || comment.user_id}
								</div>

								<div className="hidden sm:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
									{
										/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */
										comment.blog_post_name?.title ||
											/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */
											comment.listing_name?.title ||
											/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */
											comment.sublisting_name?.title
									}
								</div>

								<div className="table-cell content-center font-medium p-2 align-middle border-b-2 border-neutral-200">
									{comment.content}
								</div>

								<div className="table-cell content-center p-2 border-b-2 border-neutral-200">
									<Switch
										checked={comment.is_approved ? true : false}
										onCheckedChange={() =>
											handleApproveToggle(comment, !comment.is_approved)
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<Pagination
					itemsPerPage={itemsPerPage}
					totalItems={commentData?.length || 0}
					paginateBack={paginateBack}
					paginateFront={paginateFront}
					paginateBackFF={paginateBackFF}
					paginateFrontFF={paginateFrontFF}
					currentPage={currentPage}
					totalPages={totalPages}
					setItemsPerPage={setItemsPerPage}
					pageSizeOptions={[5, 10, 25, 50]}
					nameOfItems="items"
				/>
			</div>
		</div>
	);
}
