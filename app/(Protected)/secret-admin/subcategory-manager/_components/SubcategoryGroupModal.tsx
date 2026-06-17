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
import upsertSubcategoryGroup from '@/actions/subcategories/upsertSubcategoryGroup';
// Import Data
// Import Assets & Icons
import { PlusCircleIcon } from 'lucide-react';

// We can use this for subcategories as well because the data structure is the same
export default function SubcategoryGroupModal({
	subcategoryGroup,
	buttonSize = 'sm',
	buttonVariant = 'default',
}: {
	subcategoryGroup: {
		id: string;
		name: string;
	} | null;
	buttonSize?: 'lg' | 'sm';
	buttonVariant?: 'default' | 'outline';
}) {
	const [state, formAction] = useFormState(upsertSubcategoryGroup, undefined);
	const [subcategoryGroupName, setSubcategoryGroupName] = useState<string>(
		subcategoryGroup?.name || ''
	);

	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={buttonVariant} size={buttonSize}>
					{subcategoryGroup?.id ? (
						`Edit`
					) : (
						<>
							{' '}
							<PlusCircleIcon className="h-4 w-4 mr-1" /> Add new Subcategory
							Group
						</>
					)}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{subcategoryGroup?.id
							? `Update a subcategory group`
							: `Create a subcategory group`}
					</DialogTitle>
					<DialogDescription className="flex">
						{subcategoryGroup ? (
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
							? (setDialogOpen(false), setSubcategoryGroupName(''))
							: {}
					}
				>
					<div className="grid gap-4 w-full">
						<Input
							id="id"
							placeholder="automatic"
							name="id"
							type="hidden"
							value={subcategoryGroup?.id || ''}
						/>

						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Group Name"
								name="name"
								type="text"
								onChange={(e) => setSubcategoryGroupName(e.target.value)}
								minLength={2}
								value={subcategoryGroupName}
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
							disabled={!subcategoryGroupName}
						>
							Save
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
