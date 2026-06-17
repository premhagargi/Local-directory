'use client';
// Import Types
import { Tables } from '@/supabase-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import Pagination from '@/ui/Pagination';
import { Switch } from '@/ui/Switch';
import { Input } from '@/ui/Input';
// Import Functions & Actions & Hooks & State
import handleFeedback_ADMIN from '@/actions/feedback/handleFeedback_ADMIN';
import { capitalize, cn, formatDate } from '@/lib/utils';
import usePagination from '@/lib/usePagination';
import { toast } from '@/lib/useToaster';
// Import Data
// Import Assets & Icons

/**
 * A table component that displays feedback.
 * @param feedback - The feedback to display.
 */
export default function FeedbackTable({
	feedback,
}: {
	feedback: Tables<'feedback'>[] | null;
}) {
	const [feedbackData, setFeedbackData] = useState<Tables<'feedback'>[]>(
		feedback === null ? [] : feedback
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
		data: feedbackData,
		searchField: 'description',
	});

	const handleApproveToggle = async (
		changeFeedback: Tables<'feedback'>,
		newState: boolean
	) => {
		const newFeedbackData = feedbackData.map((feedback) => {
			if (feedback.id === changeFeedback.id) {
				feedback.is_handled = newState;
			}
			return feedback;
		});
		setFeedbackData(newFeedbackData);

		await handleFeedback_ADMIN(changeFeedback.id, newState).then((res) =>
			res.success
				? toast({
						title: `You ${newState ? 'closed' : 'opened'} this feedback!`,
				  })
				: toast({
						title: `Error: ${res.error || 'Unknown Error'}`,
				  })
		);
	};

	return (
		<div>
			<div className="w-full flex justify-end">
				<Input
					className="w-58"
					placeholder="Search in content..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>

			<div className="grid">
				<div className="table table-auto w-full mt-6">
					<div className="table-header-group">
						<div className="table-row text-sm">
							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Type
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								URL
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Description
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Email
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Created
							</div>
							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Handled
							</div>
						</div>
					</div>
					<div className="table-row-group">
						{currentData.map((feedback) => (
							<div
								key={feedback.id}
								className={cn(
									'table-row h-auto',
									feedback.is_handled && 'opacity-20'
								)}
							>
								<div className="table-cell content-center p-2 text-sm overflow-hidden  border-b-2 border-neutral-200">
									{capitalize(feedback.feedback_type || 'Unknown Type')}
								</div>

								<div className="table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200 break-words max-w-44">
									{feedback.url || 'Unknown Url'}
								</div>

								<div className="table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200 break-all">
									{feedback.description || 'No Description'}
								</div>
								<div className="table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
									{feedback.email || 'No Email'}
								</div>

								<div className="table-cell content-center text-sm p-2 align-middle border-b-2 border-neutral-200">
									{formatDate(new Date(feedback.created_at || 0))}
								</div>

								<div className="table-cell content-center text-sm p-2 border-b-2 border-neutral-200">
									<Switch
										checked={feedback.is_handled ? true : false}
										onCheckedChange={() =>
											handleApproveToggle(feedback, !feedback.is_handled)
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<Pagination
					itemsPerPage={itemsPerPage}
					totalItems={feedbackData?.length || 0}
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
