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
import upsertTagGroup from '@/actions/tags/upsertTagGroup';
// Import Data
// Import Assets & Icons
import { PlusCircleIcon } from 'lucide-react';

// We can use this for categories as well because the data structure is the same
export default function TagGroupModal({
	tagGroup,
	buttonSize = 'sm',
	buttonVariant = 'default',
}: {
	tagGroup: {
		id: string;
		name: string;
	} | null;
	buttonSize?: 'lg' | 'sm';
	buttonVariant?: 'default' | 'outline';
}) {
	const [state, formAction] = useFormState(upsertTagGroup, undefined);
	const [tagGroupName, setTagGroupName] = useState<string>(
		tagGroup?.name || ''
	);

	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={buttonVariant} size={buttonSize}>
					{tagGroup?.id ? (
						`Edit`
					) : (
						<>
							{' '}
							<PlusCircleIcon className="h-4 w-4 mr-1" /> Add new Tag Group
						</>
					)}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{tagGroup?.id ? `Update a tag group` : `Create a tag group`}
					</DialogTitle>
					<DialogDescription className="flex">
						{tagGroup ? (
							<span>Update the details below.</span>
						) : (
							<span>Not enough, yet? Add one!</span>
						)}
					</DialogDescription>
				</DialogHeader>

				<form
					action={formAction}
					onSubmit={() =>
						state?.success ? (setDialogOpen(false), setTagGroupName('')) : {}
					}
				>
					<div className="grid gap-4 w-full">
						<Input
							id="id"
							placeholder="automatic"
							name="id"
							type="hidden"
							value={tagGroup?.id || ''}
						/>

						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Group Name"
								name="name"
								type="text"
								onChange={(e) => setTagGroupName(e.target.value)}
								minLength={2}
								value={tagGroupName}
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
							disabled={!tagGroupName}
						>
							Save
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
