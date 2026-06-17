'use client';
// Import Types
import { FullPromotionType } from '@/supabase-special-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import Pagination from '@/ui/Pagination';
import { toast } from '@/lib/useToaster';
import { Switch } from '@/ui/Switch';
import { Input } from '@/ui/Input';
// Import Functions & Actions & Hooks & State
import handlePromotions_ADMIN from '@/actions/promotions/handlePromotions_ADMIN';
import usePagination from '@/lib/usePagination';
import { formatDate } from '@/lib/utils';
// Import Data
// Import Assets & Icons

/**
 * A table component that displays promotions.
 * @param promotions - The promotions to display.
 */
export default function PromotionTable({
	promotions,
}: {
	promotions: FullPromotionType[] | null;
}) {
	const [promotionData, setPromotionData] = useState<FullPromotionType[]>(
		promotions === null ? [] : promotions
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
		data: promotionData,
		searchField: 'listing_name',
	});

	const handleApproveToggle = async (
		changePromotion: FullPromotionType,
		newState: boolean
	) => {
		const newPromotionData = promotionData.map((promotion) => {
			if (promotion.id === changePromotion.id) {
				promotion.is_admin_approved = newState;
			}
			return promotion;
		});
		setPromotionData(newPromotionData);

		await handlePromotions_ADMIN({
			promotionId: changePromotion.id,
			listingId: changePromotion.listing_id!,
			newApproval: newState,
		}).then(() => {
			toast({
				title: `You ${newState ? 'approved' : 'disapproved'} this promotion!`,
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
							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Listing Name
							</div>

							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Category
							</div>

							<div className="hidden sm:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Price in $
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Start Date
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								End Date
							</div>
							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Approval
							</div>
						</div>
					</div>
					<div className="table-row-group">
						{currentData.map((promotion) => (
							<div key={promotion.id} className="table-row h-auto">
								<div className="table-cell content-center p-2 text-sm overflow-hidden  border-b-2 border-neutral-200">
									{/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */}
									{promotion.listing_name || 'Unknown Listing'}
								</div>

								<div className="hidden sm:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
									{/* @ts-ignore TODO : fix : Supabase Error: https://github.com/supabase/postgrest-js/issues/408#issuecomment-2175585000 */}
									{promotion.category_name || 'Unknown Category'}
								</div>

								<div className="hidden sm:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
									{promotion.price / 100 || '0'}
								</div>

								<div className="table-cell content-center text-sm p-2 align-middle border-b-2 border-neutral-200">
									{formatDate(new Date(promotion.start_date))}
								</div>

								<div className="table-cell content-center text-sm p-2 border-b-2 border-neutral-200">
									{formatDate(new Date(promotion.end_date))}
								</div>
								<div className="table-cell content-center text-sm p-2 border-b-2 border-neutral-200">
									<Switch
										checked={promotion.is_admin_approved ? true : false}
										onCheckedChange={() =>
											handleApproveToggle(
												promotion,
												!promotion.is_admin_approved
											)
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<Pagination
					itemsPerPage={itemsPerPage}
					totalItems={promotionData?.length || 0}
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
