'use client';

// Import Types
import { Tables } from '@/supabase-types';
// Import External Packages
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// Import Components
import SupabaseImageUploadArea from '@/components/SupabaseImageUploadArea';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/ui/Form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/ui/Card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';
import { Calendar } from '@/ui/Calendar';
// Import Functions & Actions & Hooks & State
import { cn, formatDateToTimezone } from '@/lib/utils';
import { toast } from '@/lib/useToaster';
import upsertAd from '@/actions/ads/upsertAd';
// Import Data
// Import Assets & Icons
import { CalendarIcon } from 'lucide-react';

const AdFormSchema = z.object({
	id: z.optional(z.string()),
	name: z.string().min(2, { message: 'Should at least 2 characters long' }),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
	invoice_id: z.string().optional(),
	price: z
		.number({ coerce: true })
		.min(0, { message: 'Price cannot be negative' })
		.optional(),
	contact_name: z
		.string()
		.min(2, { message: 'Should at least 2 characters long' })
		.optional(),
	contact_email: z.string().email().optional(),
	redirect_url: z.string().url(),
	image_url: z.string(),
	slot_name: z.string().optional(),
});

export default function AdEditor({
	ad,
	slotChoices,
}: {
	ad: Tables<'ad_campaigns'> | undefined;
	slotChoices: string[];
}) {
	const router = useRouter();

	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const form = useForm<z.infer<typeof AdFormSchema>>({
		resolver: zodResolver(AdFormSchema),
		defaultValues: {
			id: ad?.id || '',
			name: ad?.name || '',
			start_date: ad?.start_date ? new Date(ad?.start_date) : undefined,
			end_date: ad?.end_date ? new Date(ad?.end_date) : undefined,
			invoice_id: ad?.invoice_id || '',
			price: ad?.price !== null ? ad?.price : 0,
			contact_name: ad?.contact_name || '',
			contact_email: ad?.contact_email || '',
			redirect_url: ad?.redirect_url || '',
			image_url: ad?.image_url || '',
			slot_name: ad?.slot_name || '',
		},
	});

	const {
		formState: { isDirty, isSubmitting },
		setValue,
	} = form;

	async function onSubmit(values: z.infer<typeof AdFormSchema>) {
		await upsertAd(values)
			.then(async (response) => {
				if (!response.success) {
					toast({
						title: 'Error',
						description: `There was an error ${
							ad ? 'updating' : 'creating'
						} your ad: ${response.error}`,
					});
				} else {
					toast({
						title: 'Success',
						description: `Your ad has been ${ad ? 'updated!' : 'created!'}.`,
					});
					router.push('/secret-admin/ad-manager');
				}
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: `There was an error ${
						ad ? 'updating' : 'creating'
					} your ad: ${err}`,
				});
			});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="max-w-7xl mx-auto"
			>
				<FormField
					control={form.control}
					name="id"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="hidden" placeholder="id" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<div className="w-full grid md:flex justify-end py-4 space-x-2 items-center">
					<div className="text-center gap-2">
						<div className="h-4">
							{isDirty && <p className="text-xs">You have unsaved changes.</p>}
						</div>
						<div className="flex gap-x-2">
							<Button
								type="button"
								onClick={() => router.push('/secret-admin/ad-manager')}
								variant="outline"
								disabled={!isDirty || isSubmitting}
							>
								Discard
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								data-umami-event={ad ? 'Button Ad Update' : 'Button Ad Create'}
							>
								{ad ? 'Update' : 'Create'}
							</Button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card className="row-span-3">
						<CardHeader>
							<CardTitle>Campaign Details</CardTitle>
							<CardDescription>
								Provide the details of your ad campaign.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormDescription>
											The name of your ad campaign.
										</FormDescription>
										<FormControl>
											<Input placeholder="Name" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="contact_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Name</FormLabel>
										<FormDescription>The name of your contact.</FormDescription>
										<FormControl>
											<Input placeholder="Contact Name" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="contact_email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Email</FormLabel>
										<FormDescription>
											The email of your contact.
										</FormDescription>
										<FormControl>
											<Input placeholder="Contact Email" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="invoice_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Invoice Id</FormLabel>
										<FormDescription>Optional: Invoice Id</FormDescription>
										<FormControl>
											<Input placeholder="Invoice Id" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormDescription>
											The price IN CENTS (100 = $1) for the ad campaign.
										</FormDescription>
										<FormControl>
											<Input placeholder="Price" type="number" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Ad Details</CardTitle>
							<CardDescription>Provide details about the ad.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="slot_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Slot Name</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} {...field}>
												<SelectTrigger>
													<SelectValue placeholder="Choose the best fitting Slot" />
												</SelectTrigger>

												<SelectContent>
													{slotChoices.map((slotChoice) => (
														<SelectItem key={slotChoice} value={slotChoice}>
															{slotChoice}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormDescription>
											Where should this ad be shown? 1 means further up the
											page. 2 or 3 is usually at the bottom.{' '}
										</FormDescription>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="redirect_url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>URL of campagin</FormLabel>
										<FormDescription>
											The URL of the campaign when users click on the ad.{' '}
										</FormDescription>
										<FormControl>
											<Input placeholder="https://" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="start_date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'w-[240px] pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value ? (
															formatDateToTimezone(field.value, userTimeZone)
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={(date) => field.onChange(date)}
													disabled={(date) => date < new Date()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											The Start Date is the date the ad goes live.{' '}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="end_date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'w-[240px] pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value ? (
															formatDateToTimezone(field.value, userTimeZone)
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={(date) => field.onChange(date)}
													disabled={(date) => date < new Date()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											The End Date is the date the ad goes down.{' '}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Ad Image</CardTitle>
							<CardDescription>
								Almost all ad slots use 728x90 (leaderboard) style ads. Only
								`blog-1` and `blog-2` use 300x250 (medium rectangle).
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<FormField
								control={form.control}
								name="image_url"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<SupabaseImageUploadArea
												uid={'ad_image_upload'}
												url={ad?.image_url || field.value}
												width={900}
												height={600}
												database="ad_images"
												onUpload={(url: string) => {
													setValue('image_url', url, {
														shouldValidate: true,
														shouldDirty: true,
														shouldTouch: true,
													});
												}}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
				</div>
			</form>
		</Form>
	);
}
