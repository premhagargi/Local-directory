'use client';
// Import Types
import { Tables } from '@/supabase-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import ActionVerificationModal from '@/components/ActionVerificationModal';
import Pagination from '@/ui/Pagination';
import { Switch } from '@/ui/Switch';
import { Input } from '@/ui/Input';
// Import Functions & Actions & Hooks & State
import handleUsers_ADMIN from '@/actions/users/handleUsers_ADMIN';
import { cn, formatDate } from '@/lib/utils';
import usePagination from '@/lib/usePagination';
import { toast } from '@/lib/useToaster';
import softDeleteUser_ADMIN from '@/actions/users/softDeleteUser_ADMIN';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { CheckCircle, TrashIcon, XCircle } from 'lucide-react';

/**
 * A table component that displays users.
 * @param users - The users to display.
 */
export default function UsersTable({
	users,
}: {
	users: Tables<'users'>[] | null;
}) {
	const [usersData, setUsersData] = useState<Tables<'users'>[]>(
		users === null ? [] : users
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
		data: usersData,
		searchField: 'email',
	});

	const handleApproveToggle = async (
		changeUsers: Tables<'users'>,
		newState: boolean
	) => {
		const newUsersData = usersData.map((users) => {
			if (users.id === changeUsers.id) {
				users.is_active = newState;
			}
			return users;
		});
		setUsersData(newUsersData);

		await handleUsers_ADMIN(changeUsers.id, newState).then((res) =>
			res.success
				? toast({
						title: `You ${newState ? 'activated' : 'deactivated'} this users!`,
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
					placeholder="Search email..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>

			<div className="grid">
				<div className="table table-auto w-full mt-6">
					<div className="table-header-group">
						<div className="table-row text-sm">
							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Email
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Super Admin
							</div>

							{GENERAL_SETTINGS.USE_RBAC && (
								<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
									User Role
								</div>
							)}

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Created
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								On Hold / Active
							</div>
							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Delete
							</div>
						</div>
					</div>
					<div className="table-row-group">
						{currentData.map((user) => (
							<div key={user.id} className={cn('table-row h-auto')}>
								<div className="table-cell content-center p-2 text-sm overflow-hidden  border-b-2 border-neutral-200">
									{user.email || '---'}
								</div>

								<div className="table-cell content-center text-sm p-2 border-b-2 border-neutral-200">
									{user.is_super_admin ? (
										<CheckCircle className="w-6 h-6 text-green-500" />
									) : (
										<XCircle className="w-6 h-6 text-red-500" />
									)}
								</div>
								{GENERAL_SETTINGS.USE_RBAC && (
									<div className="table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200 break-words max-w-44">
										{user.role || '---'}
									</div>
								)}

								<div className="table-cell content-center text-sm p-2 align-middle border-b-2 border-neutral-200">
									{formatDate(new Date(user.created_at || 0))}
								</div>

								<div className="table-cell content-center text-sm p-2 border-b-2 border-neutral-200">
									<Switch
										checked={user.is_active ? true : false}
										onCheckedChange={() =>
											handleApproveToggle(user, !user.is_active)
										}
									/>
								</div>

								<div className="table-cell content-center text-sm p-2 border-b-2 border-neutral-200">
									<ActionVerificationModal
										data={user.id}
										executionFunction={softDeleteUser_ADMIN}
										buttonText=""
										buttonIcon={TrashIcon}
										modalTitle="Delete User"
										modalDescription={`Are you sure you want to delete the user: ${user.email}?`}
										modalVerficationWithAnswer={true}
										modalVerificationAnswer="DELETE"
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<Pagination
					itemsPerPage={itemsPerPage}
					totalItems={usersData?.length || 0}
					paginateBack={paginateBack}
					paginateFront={paginateFront}
					paginateBackFF={paginateBackFF}
					paginateFrontFF={paginateFrontFF}
					currentPage={currentPage}
					totalPages={totalPages}
					setItemsPerPage={setItemsPerPage}
					pageSizeOptions={[5, 10, 25, 50]}
					nameOfItems="users"
				/>
			</div>
		</div>
	);
}
