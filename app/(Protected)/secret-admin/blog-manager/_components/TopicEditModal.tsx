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
import upsertBlogTopics from '@/actions/blog/upsertBlogTopics';
// Import Data
// Import Assets & Icons
import { PlusCircleIcon } from 'lucide-react';

// We can use this for categories as well because the data structure is the same
export default function TopicEditModal({
	topic,
	buttonSize = 'sm',
	buttonVariant = 'default',
}: {
	topic: {
		id: string;
		name: string;
		slug: string;
	} | null;
	buttonSize?: 'lg' | 'sm';
	buttonVariant?: 'default' | 'outline';
}) {
	const [state, formAction] = useFormState(upsertBlogTopics, undefined);
	const [topicName, setTopicName] = useState<string>(topic?.name || '');

	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={buttonVariant} size={buttonSize}>
					{topic?.id ? (
						`Edit`
					) : (
						<>
							{' '}
							<PlusCircleIcon className="h-4 w-4 mr-1" /> Add new topic
						</>
					)}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{topic?.id ? `Update a topic` : `Add a topic`}
					</DialogTitle>
					<DialogDescription className="flex">
						{topic ? (
							<span>Update the details below.</span>
						) : (
							<span>Not enough, yet? Add one!</span>
						)}
					</DialogDescription>
				</DialogHeader>

				<form
					action={formAction}
					onSubmit={() =>
						state?.success ? (setDialogOpen(false), setTopicName('')) : {}
					}
				>
					<div className="grid gap-4 w-full">
						<Input
							id="slug"
							placeholder="automatic"
							name="slug"
							type="hidden"
							value={topic?.slug || ''}
						/>

						<Input
							id="id"
							placeholder="automatic"
							name="id"
							type="hidden"
							value={topic?.id || ''}
						/>

						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Topic name"
								name="name"
								type="text"
								onChange={(e) => setTopicName(e.target.value)}
								minLength={2}
								value={topicName}
							/>
							{!state ||
								(!state.success &&
									state?.errors?.name &&
									state?.errors?.name?.length > 0 && (
										<div className="text-red-500 text-xs">
											<p>Topic Name must:</p>
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
							disabled={!topicName}
						>
							Save
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
