'use client';
// Import Types
// Import External Packages
import { useFormState } from 'react-dom';
import { useState } from 'react';
// Import Components
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
} from '@/ui/Dialog';
// Import Functions & Actions & Hooks & State
import upsertCategoryGroup from '@/actions/categories/upsertCategoryGroup';
// Import Data
// Import Assets & Icons
import { PlusCircleIcon } from 'lucide-react';

// We can use this for categories as well because the data structure is the same
export default function CategoryGroupModal({
	categoryGroup,
	buttonSize = 'sm',
	buttonVariant = 'default',
}: {
	categoryGroup: {
		id: string;
		name: string;
	} | null;
	buttonSize?: 'lg' | 'sm';
	buttonVariant?: 'default' | 'outline';
}) {
	const [state, formAction] = useFormState(upsertCategoryGroup, undefined);
	const [categoryGroupName, setCategoryGroupName] = useState<string>(
		categoryGroup?.name || ''
	);

	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={buttonVariant} size={buttonSize}>
					{categoryGroup?.id ? (
						`Edit`
					) : (
						<>
							{' '}
							<PlusCircleIcon className="h-4 w-4 mr-1" /> Add new Category Group
						</>
					)}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{categoryGroup?.id
							? `Update a category group`
							: `Create a category group`}
					</DialogTitle>
					<DialogDescription className="flex">
						{categoryGroup ? (
							<span>Update the details below.</span>
						) : (
							<span>Not enough, yet? Add one!</span>
						)}
					</DialogDescription>
				</DialogHeader>

				<form
					action={formAction}
					onSubmit={() =>
						state?.success
							? (setDialogOpen(false), setCategoryGroupName(''))
							: {}
					}
				>
					<div className="grid gap-4 w-full">
						<Input
							id="id"
							placeholder="automatic"
							name="id"
							type="hidden"
							value={categoryGroup?.id || ''}
						/>

						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Group Name"
								name="name"
								type="text"
								onChange={(e) => setCategoryGroupName(e.target.value)}
								minLength={2}
								value={categoryGroupName}
							/>
							{!state ||
								(!state.success &&
									state?.errors?.name &&
									state?.errors?.name?.length > 0 && (
										<div className="text-red-500 text-xs">
											<p>Group Name must:</p>
											<ul>
												{state.errors.name.map((error) => (
													<li key={error}>- {error}</li>
												))}
											</ul>
										</div>
									))}
						</div>
					</div>
					<div className="flex justify-between mt-4">
						<Button
							variant="default"
							type="submit"
							size="lg"
							disabled={!categoryGroupName}
						>
							Save
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
