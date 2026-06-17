'use client';
// Import Types
// Import External Packages
import { useState } from 'react';
// Import Components
import { Button } from '@/ui/Button';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from '@/ui/Dialog';
// Import Functions & Actions & Hooks & State
import deleteCategoryGroup from '@/actions/categories/deleteCategoryGroup';
// Import Data
// Import Assets & Icons
import { XCircleIcon } from 'lucide-react';

export default function CategoryGroupDeleteModal({
	categoryGroupId,
	buttonSize = 'sm',
	buttonVariant = 'outline',
}: {
	categoryGroupId: string;
	buttonSize?: 'lg' | 'sm';
	buttonVariant?: 'default' | 'outline';
}) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={buttonVariant} size={buttonSize}>
					<XCircleIcon className="h-4 w-4 mr-1 text-primary" />{' '}
					<span className="sr-only">Delete category group</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						Are you sure you want to delete this category group?
					</DialogTitle>
				</DialogHeader>

				<div className="flex gap-2 mt-6 flex-wrap">
					<Button
						variant="default"
						type="button"
						size="lg"
						disabled={!categoryGroupId}
						onClick={async () => {
							await deleteCategoryGroup(categoryGroupId), setDialogOpen(false);
						}}
						className="w-full"
					>
						Yes, delete this category group
					</Button>
					<Button
						variant="outline"
						type="button"
						size="lg"
						disabled={!categoryGroupId}
						onClick={async () => {
							setDialogOpen(false);
						}}
						className="w-full"
					>
						No, keep this category group
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
