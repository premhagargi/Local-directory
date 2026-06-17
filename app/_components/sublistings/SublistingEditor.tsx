'use client';

// Import Types
import {
	SubcategoryType,
	SublistingType,
	SubtagType,
	FullSubtagType,
	ListingType,
} from '@/supabase-special-types';
import { Tables } from '@/supabase-types';
// Import External Packages
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Image from 'next/image';
import { z } from 'zod';
// Import Components
import SupabaseImageUploadArea from '@/components/SupabaseImageUploadArea';
import { TagSelect } from '@/ui/TagSelect';
import { Textarea } from '@/ui/Textarea';
import { Switch } from '@/ui/Switch';
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
// Import Functions & Actions & Hooks & State
import generateSublistingDescriptionWithAi from '@/actions/sublistings/generateSublistingDescriptionWithAi';
import insertActivity from '@/actions/activites/insertActivity';
import upsertSublisting from '@/actions/sublistings/upsertSublisting';
import { isValidUrl, arraysEqual } from '@/lib/utils';
import { toast } from '@/lib/useToaster';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { LoaderCircleIcon } from 'lucide-react';

const SublistingFormSchema = z.object({
	id: z.optional(z.string()),
	title: z.string().min(2, { message: 'Should at least 2 characters long' }),
	excerpt: z
		.string()
		.min(20, { message: 'Should be at least 20 characters long' })
		.max(160, { message: 'Should beat most 160 characters long' }),
	description: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
	subcategory_id: z.string().min(2, { message: 'Subcategory is missing.' }),
	listing_id: z.string().min(2, { message: 'Listing is missing.' }),
	default_image_url: z
		.string()
		.optional()
		.refine(
			(value) => value === '' || value === undefined || value.length >= 2,
			{
				message: 'Full name must be at least 2 characters long',
			}
		),
	is_user_published: z.boolean().nullable(),
	is_admin_published: z.boolean().nullable(),
	click_url: z.string().url(),
	price_regular_in_cents: z.optional(z.coerce.number()),
	price_promotional_in_cents: z.optional(z.coerce.number()),
	size: z.optional(z.string()),
	availability: z.boolean(),
});

const mdParser = new MarkdownIt();

export default function SublistingEditor({
	sublisting,
	subtagChoices,
	subcategoryChoices,
	listingChoices,
	userId,
	isSuperAdmin,
}: {
	sublisting: SublistingType | undefined;
	subtagChoices: FullSubtagType[];
	subcategoryChoices: SubcategoryType[];
	listingChoices: ListingType[];
	userId: Tables<'users'>['id'];
	isSuperAdmin: boolean;
}) {
	const [selectedSubtags, setSelectedSubtags] = useState<{
		[groupName: string]: Omit<SubtagType, 'subtag_groups'>[];
	}>(sublisting?.subtags ? groupSubtagsByGroupName(sublisting?.subtags) : {});
	const [aiGenerated, setAiGenerated] = useState(false);
	const [reloaded, setReloaded] = useState(false);
	const Router = useRouter();

	function groupSubtagsByGroupName(
		subtags: Omit<SubtagType, 'subtag_groups'>[]
	): {
		[groupName: string]: Omit<SubtagType, 'subtag_groups'>[];
	} {
		const groupedSubtags: {
			[groupName: string]: Omit<SubtagType, 'subtag_groups'>[];
		} = {};

		subtags.forEach((subtag) => {
			const subtagChoice = subtagChoices.find(
				(choice) => choice.id === subtag.id
			);
			if (subtagChoice) {
				subtagChoice.subtag_groups.forEach((group) => {
					if (!groupedSubtags[group.name]) {
						groupedSubtags[group.name] = [];
					}
					groupedSubtags[group.name].push(subtag);
				});
			}
		});

		return groupedSubtags;
	}

	const flattenedSubtags = Object.values(selectedSubtags).flat();

	function clusterSubtagsByGroups() {
		const subtagChoiceGroups: {
			[groupName: string]: (typeof subtagChoices)[0][];
		} = { Other: [] };

		subtagChoices.forEach((subtag) => {
			if (subtag.subtag_groups.length === 0) {
				subtagChoiceGroups['Other'].push(subtag);
			} else {
				subtag.subtag_groups.forEach((group) => {
					if (!subtagChoiceGroups[group.name]) {
						subtagChoiceGroups[group.name] = [];
					}
					subtagChoiceGroups[group.name].push(subtag);
				});
			}
		});

		if (subtagChoiceGroups['Other'].length === 0) {
			delete subtagChoiceGroups['Other'];
		}

		return subtagChoiceGroups;
	}

	const subtagChoiceGroups = clusterSubtagsByGroups();

	const form = useForm<z.infer<typeof SublistingFormSchema>>({
		resolver: zodResolver(SublistingFormSchema),
		defaultValues: {
			id: sublisting?.id ?? '',
			title: sublisting?.title ?? '',
			description: sublisting?.description ?? '',
			excerpt: sublisting?.excerpt ?? '',
			click_url: sublisting?.click_url ?? '',
			subcategory_id: sublisting?.subcategory_id ?? '',
			listing_id: sublisting?.listing_id ?? '',
			is_user_published: sublisting?.is_user_published ?? false,
			is_admin_published: sublisting?.is_admin_published ?? false,
			default_image_url: sublisting?.default_image_url ?? '',
			price_regular_in_cents: sublisting?.price_regular_in_cents ?? 0,
			price_promotional_in_cents: sublisting?.price_promotional_in_cents ?? 0,
			size: sublisting?.size ?? '',
			availability: sublisting?.availability ?? false,
		},
	});

	const {
		formState: { isDirty, dirtyFields, isSubmitting },
		setValue,
	} = form;

	const needsReEmbedding =
		dirtyFields.title || dirtyFields.description || dirtyFields.excerpt;

	const handleAiButton = async (url: string) => {
		const aiReponseObject = await generateSublistingDescriptionWithAi(url);
		if (!aiReponseObject || aiReponseObject.error) {
			toast({
				title: 'Error',
				description:
					'There was an error generating the AI description. Please try again.',
			});
			setAiGenerated(false);
			return null;
		}
		setValue('description', aiReponseObject.data.description, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
		setValue('excerpt', aiReponseObject.data.excerpt, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
		setAiGenerated(false);
		toast({
			title: 'Success',
			description: 'Your sublisting has been updated.',
		});
	};

	// Handle subtag changes
	const handleSubtagChange = (
		value: { name: string }[],
		groupName: string | undefined
	) => {
		// Enrich the subtags with additional information
		const enrichedValue = value
			.map((subtag) => {
				const tempSubtag = subtagChoices.find(
					(subtagChoice) => subtagChoice.name === subtag.name
				);
				return tempSubtag
					? { id: tempSubtag.id, name: subtag.name, slug: tempSubtag.slug }
					: null;
			})
			.filter((subtag): subtag is SubtagType => subtag !== null); // Filter out null values

		setSelectedSubtags((prevSelectedSubtags) => {
			const updatedSubtags = {
				...prevSelectedSubtags,
				[groupName as string]: enrichedValue,
			};

			// Return the updated subtags
			return updatedSubtags;
		});
	};

	async function onSubmit(values: z.infer<typeof SublistingFormSchema>) {
		let subtagIds = flattenedSubtags
			.map((subtag) => {
				const existingSubtag = subtagChoices.find(
					(subtagChoice) => subtagChoice.name === subtag.name
				);
				if (existingSubtag) {
					return existingSubtag.id;
				} else {
					return null;
				}
			})
			.filter((subtagId) => subtagId !== null) as string[];

		await upsertSublisting(values, subtagIds, !!needsReEmbedding)
			.then(async (response) => {
				if (!response.success) {
					toast({
						title: 'Error',
						description: `There was an error ${
							sublisting ? 'updating' : 'creating'
						} your sublisting: ${response.error}`,
					});
				} else {
					toast({
						title: 'Success',
						description: `Your sublisting has been ${
							sublisting ? 'updated!' : 'created!'
						}.`,
					});
					await insertActivity(
						sublisting ? 'update_sublisting' : 'new_sublisting',
						values.title
					);
					Router.push('/account/sublistings');
				}
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: `There was an error ${
						sublisting ? 'updating' : 'creating'
					} your sublisting: ${err}`,
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
								onClick={() => Router.push('/account/sublistings')}
								variant="outline"
								disabled={isSubmitting}
							>
								Discard
							</Button>
							<Button
								type="submit"
								disabled={
									(!isDirty &&
										(sublisting?.subtags
											? arraysEqual(sublisting?.subtags, flattenedSubtags)
											: flattenedSubtags.length === 0)) ||
									isSubmitting
								}
								data-umami-event={
									sublisting
										? 'Button Sublisting Update'
										: 'Button Sublisting Create'
								}
							>
								{sublisting ? 'Update' : 'Create'}
							</Button>
							{sublisting && (
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										Router.refresh(),
											setReloaded(true),
											setTimeout(() => {
												toast({
													title: 'Reloaded!',
													description: `You are seeing fresh data`,
												});
											}, 1000);
									}}
									disabled={reloaded}
								>
									Reload Data
								</Button>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-5 md:gap-12 gap-y-8 md:gap-y-0">
					<Card className="col-span-3">
						<CardHeader>
							<CardTitle>Description Details</CardTitle>
							<CardDescription>
								Title, description, and the excerpt of your sublisting. Make it
								interesting!
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormDescription>
											This is the public title of your sublisting. Will be used
											as the OpenGraph title.
										</FormDescription>
										<FormControl>
											<Input placeholder="Title" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormDescription>
											This is the long form content of your sublisting.
											(Supports Markdown)
										</FormDescription>
										<FormControl>
											<MdEditor
												value={field.value}
												className="h-full"
												renderHTML={(text) => mdParser.render(text)}
												onChange={({ text }) => field.onChange(text)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="excerpt"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Excerpt</FormLabel>
										<FormDescription>
											This is the short form content of your sublisting. Will be
											used as the OpenGraph description.
										</FormDescription>
										<FormControl>
											<Textarea rows={3} placeholder="Excerpt" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<div className="col-span-2 grid gap-y-8 w-full">
						<Card>
							<CardHeader>
								<CardTitle>Publish</CardTitle>
								<CardDescription>
									You sublisting is currently in the{' '}
									<span className="font-semibold">
										{sublisting?.is_user_published ? 'published' : 'draft'}
									</span>{' '}
									state.{' '}
								</CardDescription>
							</CardHeader>
							<CardContent className="grid">
								<FormField
									control={form.control}
									name="is_user_published"
									render={({ field }) => (
										<FormItem className="inline-flex space-y-0 h-10 items-center space-x-4">
											<FormLabel>Is Product Published?</FormLabel>

											<FormControl>
												<Switch
													checked={field.value ? true : false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{isSuperAdmin && (
									<FormField
										control={form.control}
										name="is_admin_published"
										render={({ field }) => (
											<FormItem className="inline-flex space-y-0 h-10 items-center space-x-4">
												<FormLabel>Is Product Approved by ADMIN?</FormLabel>

												<FormControl>
													<Switch
														checked={field.value ? true : false}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}

								<FormField
									control={form.control}
									name="availability"
									render={({ field }) => (
										<FormItem className="inline-flex space-y-0 h-10 items-center space-x-4">
											<FormLabel>Is Product Currently Available?</FormLabel>

											<FormControl>
												<Switch
													checked={field.value ? true : false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Subtags & Subcategories</CardTitle>
								<CardDescription>
									Let people know what your sublisting is about.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{Object.keys(subtagChoiceGroups).map((groupName) => (
									<TagSelect
										key={groupName}
										updaterFunction={handleSubtagChange}
										possibleTags={
											subtagChoiceGroups[groupName] as { name: string }[]
										}
										selectedTags={
											sublisting
												? (selectedSubtags[groupName] as { name: string }[]) ||
												  undefined
												: null
										}
										label={`Subtag Group: ${groupName}`}
										placeholder="Choose the subtags that fit your sublisting"
										whatIsSelected={groupName}
										code={groupName}
									/>
								))}

								<FormField
									control={form.control}
									name="subcategory_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Subcategory</FormLabel>
											<FormControl>
												<Select onValueChange={field.onChange} {...field}>
													<SelectTrigger>
														<SelectValue placeholder="Choose the best fitting Subcategory" />
													</SelectTrigger>

													<SelectContent>
														{subcategoryChoices.map((subcategory) => (
															<SelectItem
																key={subcategory.id}
																value={subcategory.id}
															>
																{subcategory.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormDescription>
												The main subcategory of your sublisting. Choose wisely.
											</FormDescription>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="listing_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Associated Listing</FormLabel>
											<FormControl>
												<Select onValueChange={field.onChange} {...field}>
													<SelectTrigger>
														<SelectValue placeholder="Choose the best fitting listing" />
													</SelectTrigger>

													<SelectContent>
														{listingChoices &&
															listingChoices.map((listing) => (
																<SelectItem key={listing.id} value={listing.id}>
																	{listing.title}
																</SelectItem>
															))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormDescription>
												To which of your listings does this sublisting belong?
											</FormDescription>

											<FormMessage />
										</FormItem>
									)}
								/>

								<p className="italic text-xs pt-6 text-muted-foreground">
									If you need a new Subtags or Subcategories, send us an email{' '}
									{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}!
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Prices</CardTitle>
								<CardDescription>
									Let people know what your product costs!
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="price_regular_in_cents"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Regular Price (in cents)</FormLabel>
											<FormDescription>
												What is the regular price of the product?{' '}
											</FormDescription>
											<FormControl>
												<Input {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="price_promotional_in_cents"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Promotional Price (in cents)</FormLabel>
											<FormDescription>
												What is the currently discounted price of the product?{' '}
											</FormDescription>
											<FormControl>
												<Input {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="size"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Size (e.g. 1lbs)</FormLabel>
											<FormDescription>
												What is the size which is corresponding to the price?{' '}
											</FormDescription>
											<FormControl>
												<Input {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Linking Details</CardTitle>
								<CardDescription>
									Choose where your sublisting will be linked to.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="click_url"
									render={({ field }) => (
										<FormItem>
											<FormLabel>URL</FormLabel>
											<FormDescription>
												The (affiliate) link which users will be redirected to.
											</FormDescription>
											<FormControl>
												<Input placeholder="https://" {...field} />
											</FormControl>
											<FormMessage />
											{!isValidUrl(field.value) && (
												<>
													<span className="text-xs italic">
														Please enter a valid URL
													</span>
													<br />
												</>
											)}
											{GENERAL_SETTINGS.USE_AI_CONTENT_CREATION &&
												isSuperAdmin && (
													<Button
														type="button"
														onClick={() => {
															setAiGenerated(true), handleAiButton(field.value);
														}}
														variant="outline"
														disabled={
															isSubmitting ||
															!isValidUrl(field.value) ||
															aiGenerated
														}
														data-umami-event="Button AI Description"
														data-umami-event-userid={userId}
													>
														<span>Generate AI Description</span>{' '}
														{aiGenerated && (
															<LoaderCircleIcon className="ml-1 animate-spin" />
														)}
													</Button>
												)}
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Cover Image</CardTitle>
								<CardDescription>Visuals are important!</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<FormField
									control={form.control}
									name="default_image_url"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<SupabaseImageUploadArea
													uid={userId}
													url={sublisting?.default_image_url || field.value}
													width={900}
													height={600}
													database="sublisting_images"
													onUpload={(url: string) => {
														setValue('default_image_url', url, {
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
								{sublisting && sublisting.is_admin_published && (
									<>
										<CardTitle className="pt-6">Feature Badge</CardTitle>
										<CardDescription>
											Download our Badge and show that you are featured on our
											website! You can link to: <br /> <br />
											<span className="italic">{`${COMPANY_BASIC_INFORMATION.URL}/products/${sublisting.slug}`}</span>
										</CardDescription>
										<Image
											src="/img/featured_badge.png"
											alt="Feature Badge"
											width={1200}
											height={400}
										/>
									</>
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Defined Details</CardTitle>
								<CardDescription>Stuff you cannot change</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								{sublisting && (
									<>
										<FormItem>
											<FormLabel>Slug</FormLabel>
											<Input value={sublisting.slug} disabled />
										</FormItem>
										<FormItem>
											<FormLabel>Sublisting ID</FormLabel>
											<Input value={sublisting.id} disabled />
										</FormItem>
										<FormItem>
											<FormLabel>Views</FormLabel>
											<Input value={sublisting.views ?? 0} disabled />
										</FormItem>
										<FormItem>
											<FormLabel>Likes</FormLabel>
											<Input value={sublisting.likes ?? 0} disabled />
										</FormItem>
										<FormItem>
											<FormLabel>Clicks</FormLabel>
											<Input value={sublisting.clicks ?? 0} disabled />
										</FormItem>
										<FormItem className="grid pt-2">
											<FormLabel>Admin Approval</FormLabel>
											<FormDescription>
												Once you publish, our admins will review your
												sublisting.
											</FormDescription>
											<Switch
												checked={sublisting.is_admin_published ?? false}
												disabled
											/>
										</FormItem>
										<FormItem className="grid pt-2">
											<FormLabel>Is Promoted</FormLabel>
											<FormDescription>
												(Send an email to{' '}
												{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL} if you wish to
												promote this sublisting.)
											</FormDescription>
											<Switch
												checked={sublisting.is_promoted ?? false}
												disabled
											/>
										</FormItem>
									</>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</form>
		</Form>
	);
}
