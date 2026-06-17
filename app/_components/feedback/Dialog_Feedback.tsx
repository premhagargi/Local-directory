'use client';

// Import Types
// Import External Packages
import { usePathname } from 'next/navigation';
import { useFormState } from 'react-dom';
// Import Components
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
import { Label } from '@/ui/Label';
import { Input } from '@/ui/Input';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
} from '@/ui/Dialog';
// Import Functions & Actions & Hooks & State
import insertFeedback from '@/actions/feedback/insertFeedback';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { MessageCircleIcon } from 'lucide-react';

export default function FeedbackDialog() {
	const [state, formAction] = useFormState(insertFeedback, undefined);
	const pathname = usePathname();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="rounded-md fixed bottom-5 right-5 z-50 hidden sm:block"
				>
					<MessageCircleIcon size="20" />
					<span className="sr-only">Feedback Button</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Do you have feedback?</DialogTitle>
					<DialogDescription>
						Feature whishlist, bug report, or just want to say hi? Let us know!
					</DialogDescription>
				</DialogHeader>

				{!state?.success ? (
					<form action={formAction}>
						<div className="grid gap-4">
							<div>
								<Input
									id="feedback_type"
									value="feedback"
									name="feedback_type"
									type="hidden"
								/>
								<Input
									id="url"
									name="url"
									type="hidden"
									value={`${COMPANY_BASIC_INFORMATION.URL}${pathname}`}
								/>
							</div>

							<div>
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									placeholder="I would like to see..."
									name="description"
								/>
								{state?.errors?.description &&
									state?.errors?.description?.length > 0 && (
										<div className="text-red-500 text-xs">
											<p>Description must:</p>
											<ul>
												{state.errors.description.map((error: string) => (
													<li key={error}>- {error}</li>
												))}
											</ul>
										</div>
									)}
							</div>

							<div>
								<Label htmlFor="email">
									Your email (optional, if you want to hear from us back)
								</Label>
								<Input
									id="email"
									placeholder="you@example.com"
									name="email"
									type="email"
								/>
								{state?.errors?.email && state?.errors?.email?.length > 0 && (
									<div className="text-red-500 text-xs">
										<p>Email must:</p>
										<ul>
											{state.errors.email.map((error: string) => (
												<li key={error}>- {error}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>
						<Button
							variant="default"
							type="submit"
							size="lg"
							disabled={state?.success}
							className="mt-4"
						>
							Submit
						</Button>
					</form>
				) : (
					<p className="flex max-w-xl">
						Thank you for your feedback! If you entered your email, we will get
						back to you soon.
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
