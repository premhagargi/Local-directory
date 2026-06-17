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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/ui/Tooltip';
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
import { FlagIcon } from 'lucide-react';

export default function ReportDialog() {
	const [state, formAction] = useFormState(insertFeedback, undefined);
	const pathname = usePathname();
	return (
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="outline" className="rounded-full p-2">
								<FlagIcon size="20" />
								<span className="sr-only">Report this listing.</span>
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Report it!</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Report This Listing</DialogTitle>
					<DialogDescription className="flex">
						<span>Something wrong with this listing? Report it!</span>
					</DialogDescription>
				</DialogHeader>

				{!state?.success ? (
					<form action={formAction}>
						<div className="grid gap-4">
							<div>
								<Input
									id="feedback_type"
									value="report"
									name="feedback_type"
									type="hidden"
								/>
							</div>
							<div>
								<Label htmlFor="url">Url of Listing</Label>
								<Input
									id="url"
									placeholder="https://example.com"
									name="url"
									type="text"
									defaultValue={`${COMPANY_BASIC_INFORMATION.URL}${pathname}`}
								/>
								{state?.errors?.url && state?.errors?.url?.length > 0 && (
									<div className="text-red-500 text-xs">
										<p>Url must:</p>
										<ul>
											{state.errors.url.map((error: string) => (
												<li key={error}>- {error}</li>
											))}
										</ul>
									</div>
								)}
							</div>
							<div>
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									placeholder="This listing is not accurate because..."
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
						Thank you for your contribution! If you entered your email, we will
						get back to you soon.
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
