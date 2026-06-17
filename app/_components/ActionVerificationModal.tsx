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
	DialogFooter,
	DialogDescription,
} from '@/ui/Dialog';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
// Import Functions & Actions & Hooks & State
import { toast } from '@/lib/useToaster';
// Import Data
// Import Assets & Icons
import { LoaderCircleIcon, LucideIcon, XCircleIcon } from 'lucide-react';
// Import Error Handling
import { ServerResponse } from '@/lib/handlingServerResponses';

export default function ActionVerificationModal({
	data,
	executionFunction,
	buttonText = 'Hello',
	buttonIcon = XCircleIcon,
	modalTitle = 'Action Verification',
	modalDescription = 'Are you sure you want to perform this action?',
	modalVerficationWithAnswer = true,
	modalVerificationAnswer = 'yes',
}: {
	data: any;
	executionFunction: (
		data: any
	) => Promise<ServerResponse<any, Record<string, string[]>>>;
	buttonText?: string;
	buttonIcon?: LucideIcon;
	modalTitle?: string;
	modalDescription?: string;
	modalVerficationWithAnswer?: boolean;
	modalVerificationAnswer?: string;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [verificationAnswer, setVerificationAnswer] = useState('');

	const ButtonIcon = buttonIcon || XCircleIcon;

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<ButtonIcon className="h-4 w-4 mr-1 text-primary" />{' '}
					{!!buttonText && buttonText}
					<span className="sr-only">{modalTitle}</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{modalTitle}</DialogTitle>
					<DialogDescription>{modalDescription}</DialogDescription>
				</DialogHeader>
				{modalVerficationWithAnswer && (
					<div className="py-8 space-y-2">
						<Label htmlFor="verificationAnswer">
							Verification: Type{' " '}
							{<span className="font-bold">{modalVerificationAnswer}</span>}
							{' " '} to confirm your action.
						</Label>
						<Input
							id="verificationAnswer"
							type="text"
							placeholder={modalVerificationAnswer}
							onChange={(e) => setVerificationAnswer(e.target.value)}
							className="w-full border border-gray-300 rounded-lg p-2"
						/>
					</div>
				)}
				<DialogFooter>
					<Button variant="outline" onClick={() => setDialogOpen(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={async () => {
							setIsSubmitting(true);
							await executionFunction(data)
								.then(async (response) => {
									if (!response.success) {
										toast({
											title: 'Error',
											description: `There was an error: ${response.error}`,
										});
										setIsSubmitting(false);
									} else {
										window.location.reload();
										setIsSubmitting(false);
									}
								})
								.catch((err) => {
									console.error(err);
									toast({
										title: 'Error',
										description: `There was an error: ${err}`,
									});
									setIsSubmitting(false);
								});
							setDialogOpen(false);
						}}
						disabled={
							!data ||
							!executionFunction ||
							(modalVerficationWithAnswer &&
								verificationAnswer !== modalVerificationAnswer) ||
							isSubmitting
						}
					>
						{isSubmitting ? (
							<span className={isSubmitting ? 'animate-spin' : ''}>
								<LoaderCircleIcon />
							</span>
						) : (
							'Confirm'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
