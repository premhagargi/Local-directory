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
import deleteTagGroup from '@/actions/tags/deleteTagGroup';
// Import Data
// Import Assets & Icons
import { XCircleIcon } from 'lucide-react';

export default function TagGroupDeleteModal({
	tagGroupId,
	buttonSize = 'sm',
	buttonVariant = 'outline',
}: {
	tagGroupId: string;
	buttonSize?: 'lg' | 'sm';
	buttonVariant?: 'default' | 'outline';
}) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={buttonVariant} size={buttonSize}>
					<XCircleIcon className="h-4 w-4 mr-1 text-primary" />{' '}
					<span className="sr-only">Delete tag group</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						Are you sure you want to delete this tag group?
					</DialogTitle>
				</DialogHeader>

				<div className="flex gap-2 mt-6 flex-wrap">
					<Button
						variant="default"
						type="button"
						size="lg"
						disabled={!tagGroupId}
						onClick={async () => {
							await deleteTagGroup(tagGroupId), setDialogOpen(false);
						}}
						className="w-full"
					>
						Yes, delete this tag group
					</Button>
					<Button
						variant="outline"
						type="button"
						size="lg"
						disabled={!tagGroupId}
						onClick={async () => {
							setDialogOpen(false);
						}}
						className="w-full"
					>
						No, keep this tag group
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
