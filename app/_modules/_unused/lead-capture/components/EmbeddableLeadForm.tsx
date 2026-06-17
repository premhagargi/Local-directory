'use client';

// Import Types
import {
	ListingType,
	SublistingsType,
	SublistingType,
} from '@/supabase-special-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import { Button } from '@/ui/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/ui/Dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/ui/Sheet';
import LeadForm from './LeadForm';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

type EmbedType = 'inline' | 'modal' | 'sheet';

interface EmbeddableLeadFormProps {
	embedType: EmbedType;
	listing: ListingType | undefined;
	sublistings: SublistingsType | undefined;
	sublisting: SublistingType | undefined;
	buttonText?: string;
	buttonClassName?: string;
}

export default function EmbeddableLeadForm({
	embedType = 'inline',
	listing,
	sublisting,
	sublistings,
	buttonText = 'Contact Us',
	buttonClassName,
}: EmbeddableLeadFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmissionSuccess = () => {
		setIsSubmitted(true);
		if (embedType !== 'inline') {
			setIsOpen(false);
		}
	};

	if (embedType === 'inline' && isSubmitted) {
		return (
			<div className="p-6 bg-green-100 rounded-lg text-center">
				<h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
				<p className="text-green-700">
					We&apos;ve received your information and will be in touch soon.
				</p>
			</div>
		);
	}

	const LeadFormWrapper = () => (
		<LeadForm
			listing={listing}
			sublistings={sublistings}
			sublisting={sublisting}
			onSubmissionSuccess={handleSubmissionSuccess}
		/>
	);

	const triggerButton = (
		<Button
			variant="outline"
			disabled={isSubmitted}
			className={cn(buttonClassName)}
		>
			{isSubmitted ? 'Thank you!' : buttonText}
		</Button>
	);

	switch (embedType) {
		case 'modal':
			return (
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>{triggerButton}</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<LeadFormWrapper />
					</DialogContent>
				</Dialog>
			);
		case 'sheet':
			return (
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>{triggerButton}</SheetTrigger>
					<SheetContent side="right">
						<LeadFormWrapper />
					</SheetContent>
				</Sheet>
			);
		case 'inline':
		default:
			return <LeadFormWrapper />;
	}
}
