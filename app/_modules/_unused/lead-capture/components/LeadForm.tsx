'use client';

// Import Types
import {
	ListingType,
	SublistingsType,
	SublistingType,
} from '@/supabase-special-types';
import { LeadFormInsertDataType, LeadFormInsertSchema } from '../types/types';
// Import External Packages
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';
// Import Components
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/ui/Form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/ui/Select';
// Import Functions & Actions & Hooks & State
import createLead from '../actions/createLead';
import { toast } from '@/lib/useToaster';
// Import Data
// Import Assets & Icons
import { LoaderCircleIcon } from 'lucide-react';

export default function LeadForm({
	listing,
	sublistings,
	sublisting,
	onSubmissionSuccess,
}: {
	listing: ListingType | undefined;
	sublistings: SublistingsType | undefined;
	sublisting?: SublistingType | undefined;
	onSubmissionSuccess?: () => void;
}) {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LeadFormInsertDataType>({
		resolver: zodResolver(LeadFormInsertSchema),
		defaultValues: {
			name: '',
			email: '',
			listingId: listing?.id || '',
			sublistingId: '',
			ownerId:
				listing && listing.owner_id
					? listing.owner_id
					: sublisting && sublisting.finder_id
					? sublisting.finder_id
					: '',
			message: '',
		},
	});

	const { watch } = form;

	const onSubmit = async (values: LeadFormInsertDataType) => {
		setIsLoading(true);

		const newLead = await createLead(values);

		if (newLead.success) {
			setIsSubmitted(true);
			toast({
				title: 'Thanks!',
				description: "Your message has been sent. We'll be in touch soon.",
			});
			if (onSubmissionSuccess) {
				onSubmissionSuccess();
			}
		} else {
			toast({
				title: 'Error',
				description:
					'There was an error sending your message. Please try again.',
			});
		}
		setIsLoading(false);
	};

	return (
		<div className="p-0">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{!!listing && (
						<FormField
							control={form.control}
							name="listingId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="hidden" placeholder="id" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					)}

					{!!sublisting && (
						<FormField
							control={form.control}
							name="sublistingId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="hidden" placeholder="id" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="ownerId"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input type="hidden" placeholder="ownerId" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Your name"
										{...field}
										autoComplete="name"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* test@test.com */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="your.email@example.com"
										{...field}
										autoComplete="email"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{!!listing && (
						<FormItem>
							<FormLabel>Listing</FormLabel>
							<FormControl>
								<Input value={listing?.title} disabled />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}

					{!!sublisting && (
						<FormItem>
							<FormLabel>Listing</FormLabel>
							<FormControl>
								<Input value={sublisting?.title} disabled />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}

					{sublistings && sublistings?.length > 0 && (
						<FormField
							control={form.control}
							name="sublistingId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product</FormLabel>
									<Select onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a product" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sublistings?.map((sublisting) => (
												<SelectItem
													key={sublisting.title}
													value={sublisting.id}
												>
													{sublisting.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Additional Comments (Optional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Any specific questions or requirements?"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{watch('name') === '' || watch('email') === '' ? null : (
						<p className="text-xs">
							By submitting, you agree to our{' '}
							<Link href="/privacy-policy" className="underline">
								Privacy Policy.
							</Link>{' '}
						</p>
					)}

					<Button
						type="submit"
						className="w-full"
						disabled={
							isSubmitted ||
							isLoading ||
							watch('name') === '' ||
							watch('email') === ''
						}
					>
						{isLoading ? (
							<LoaderCircleIcon className="animate-spin" />
						) : watch('name') === '' || watch('email') === '' ? (
							'Waiting for your input.'
						) : (
							'Submit'
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
