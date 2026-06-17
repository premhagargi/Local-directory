'use client';

// Import Types
import {
	CategoryType,
	ListingType,
	TagType,
	FullTagType,
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
import generateListingDescriptionWithAi from '@/actions/listings/generateListingDescriptionWithAi';
import insertActivity from '@/actions/activites/insertActivity';
import upsertListing from '@/actions/listings/upsertListing';
import { isValidUrl, arraysEqual } from '@/lib/utils';
import { toast } from '@/lib/useToaster';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import { LoaderCircleIcon } from 'lucide-react';

const ListingFormSchema = z.object({
	id: z.optional(z.string()),
	title: z.string().min(2, { message: 'Should at least 2 characters long' }),
	excerpt: z
		.string()
		.min(20, { message: 'Should be at least 20 characters long' })
		.max(160, { message: 'Should beat most 160 characters long' }),
	description: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
	category_id: z.string().min(2, { message: 'Category is missing.' }),
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
	discount_code_text: z.string().optional(),
	discount_code_percentage: z.string().optional(),
	discount_code: z.string().optional(),
	logo_image_url: z.string().optional(),
});

const mdParser = new MarkdownIt();

export default function ListingEditor({
	listing,
	tagChoices,
	categoryChoices,
	userId,
	isSuperAdmin,
}: {
	listing: ListingType | undefined;
	tagChoices: FullTagType[];
	categoryChoices: CategoryType[];
	userId: Tables<'users'>['id'];
	isSuperAdmin: boolean;
}) {
	const [selectedTags, setSelectedTags] = useState<{
		[groupName: string]: Omit<TagType, 'tag_groups'>[];
	}>(listing?.tags ? groupTagsByGroupName(listing?.tags) : {});
	const [aiGenerated, setAiGenerated] = useState(false);
	const [reloaded, setReloaded] = useState(false);
	const Router = useRouter();

	function groupTagsByGroupName(tags: Omit<TagType, 'tag_groups'>[]): {
		[groupName: string]: Omit<TagType, 'tag_groups'>[];
	} {
		const groupedTags: { [groupName: string]: Omit<TagType, 'tag_groups'>[] } =
			{};

		tags.forEach((tag) => {
			const tagChoice = tagChoices.find((choice) => choice.id === tag.id);
			if (tagChoice) {
				tagChoice.tag_groups.forEach((group) => {
					if (!groupedTags[group.name]) {
						groupedTags[group.name] = [];
					}
					groupedTags[group.name].push(tag);
				});
			}
		});

		if (Object.keys(groupedTags).length === 0) {
			groupedTags['Other'] = tags;
		}

		return groupedTags;
	}

	const flattenedTags = Object.values(selectedTags).flat();

	function clusterTagsByGroups() {
		const tagChoiceGroups: {
			[groupName: string]: (typeof tagChoices)[0][];
		} = { Other: [] };

		tagChoices.forEach((tag) => {
			if (tag.tag_groups.length === 0) {
				tagChoiceGroups['Other'].push(tag);
			} else {
				tag.tag_groups.forEach((group) => {
					if (!tagChoiceGroups[group.name]) {
						tagChoiceGroups[group.name] = [];
					}
					tagChoiceGroups[group.name].push(tag);
				});
			}
		});

		return tagChoiceGroups;
	}

	const tagChoiceGroups = clusterTagsByGroups();

	const form = useForm<z.infer<typeof ListingFormSchema>>({
		resolver: zodResolver(ListingFormSchema),
		defaultValues: {
			id: listing?.id ?? '',
			title: listing?.title ?? '',
			description: listing?.description ?? '',
			excerpt: listing?.excerpt ?? '',
			click_url: listing?.click_url ?? '',
			category_id: listing?.category_id ?? '',
			is_user_published: listing?.is_user_published ?? false,
			is_admin_published: listing?.is_admin_published ?? false,
			default_image_url: listing?.default_image_url ?? '',
			discount_code_text: listing?.discount_code_text ?? '',
			discount_code_percentage: listing?.discount_code_percentage ?? '',
			discount_code: listing?.discount_code ?? '',
			logo_image_url: listing?.logo_image_url ?? '',
		},
	});

	const {
		formState: { isDirty, dirtyFields, isSubmitting },
		setValue,
	} = form;

	const needsReEmbedding =
		dirtyFields.title || dirtyFields.description || dirtyFields.excerpt;

	const handleAiButton = async (url: string) => {
		const aiReponseObject = await generateListingDescriptionWithAi(url);
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
			description: 'Your listing has been updated.',
		});
	};

	// Handle tag changes
	const handleTagChange = (
		value: { name: string }[],
		groupName: string | undefined
	) => {
		// Enrich the tags with additional information
		const enrichedValue = value
			.map((tag) => {
				const tempTag = tagChoices.find(
					(tagChoice) => tagChoice.name === tag.name
				);
				return tempTag
					? { id: tempTag.id, name: tag.name, slug: tempTag.slug }
					: null;
			})
			.filter((tag): tag is TagType => tag !== null); // Filter out null values

		setSelectedTags((prevSelectedTags) => {
			const updatedTags = {
				...prevSelectedTags,
				[groupName as string]: enrichedValue,
			};

			// Return the updated tags
			return updatedTags;
		});
	};

	async function onSubmit(values: z.infer<typeof ListingFormSchema>) {
		let tagIds = flattenedTags
			.map((tag) => {
				const existingTag = tagChoices.find(
					(tagChoice) => tagChoice.name === tag.name
				);
				if (existingTag) {
					return existingTag.id;
				} else {
					return null;
				}
			})
			.filter((tagId) => tagId !== null) as string[];

		await upsertListing(values, tagIds, !!needsReEmbedding)
			.then(async (response) => {
				if (!response.success) {
					toast({
						title: 'Error',
						description: `There was an error ${
							listing ? 'updating' : 'creating'
						} your listing: ${response.error}`,
					});
				} else {
					toast({
						title: 'Success',
						description: `Your listing has been ${
							listing ? 'updated!' : 'created!'
						}.`,
					});
					await insertActivity(
						listing ? 'update_listing' : 'new_listing',
						values.title
					);
					Router.push('/account/listings');
				}
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: `There was an error ${
						listing ? 'updating' : 'creating'
					} your listing: ${err}`,
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
								onClick={() => Router.push('/account/listings')}
								variant="outline"
								disabled={isSubmitting}
							>
								Discard
							</Button>
							<Button
								type="submit"
								disabled={
									(!isDirty &&
										(listing?.tags
											? arraysEqual(listing?.tags, flattenedTags)
											: flattenedTags.length === 0)) ||
									isSubmitting
								}
								data-umami-event={
									listing ? 'Button Listing Update' : 'Button Listing Create'
								}
							>
								{listing ? 'Update' : 'Create'}
							</Button>
							{listing && (
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
								Title, description, and the excerpt of your listing. Make it
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
											This is the public title of your listing. Will be used as
											the OpenGraph title.
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
											This is the long form content of your listing. (Supports
											Markdown)
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
											This is the short form content of your listing. Will be
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
									You listing is currently in the{' '}
									<span className="font-semibold">
										{listing?.is_user_published ? 'published' : 'draft'}
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
											<FormLabel>
												{' '}
												{listing?.is_user_published
													? 'Deactivate: '
													: 'Activate: '}
											</FormLabel>

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
												<FormLabel>
													{' '}
													{listing?.is_admin_published
														? 'ADMIN: Deactivate: '
														: 'ADMIN: Activate: '}
												</FormLabel>

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
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Tags & Categories</CardTitle>
								<CardDescription>
									Let people know what your listing is about.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{Object.keys(tagChoiceGroups).map((groupName) => (
									<TagSelect
										key={groupName}
										updaterFunction={handleTagChange}
										possibleTags={
											tagChoiceGroups[groupName] as { name: string }[]
										}
										selectedTags={
											listing
												? (selectedTags[groupName] as { name: string }[]) ||
												  undefined
												: null
										}
										label={`Tag Group: ${groupName}`}
										placeholder="Choose the tags that fit your listing"
										whatIsSelected={groupName}
										code={groupName}
									/>
								))}

								<FormField
									control={form.control}
									name="category_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<FormControl>
												<Select onValueChange={field.onChange} {...field}>
													<SelectTrigger>
														<SelectValue placeholder="Choose the best fitting Category" />
													</SelectTrigger>

													<SelectContent>
														{categoryChoices.map((category) => (
															<SelectItem key={category.id} value={category.id}>
																{category.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormDescription>
												The main category of your listing. Choose wisely.
											</FormDescription>

											<FormMessage />
										</FormItem>
									)}
								/>

								<p className="italic text-xs pt-6 text-muted-foreground">
									If you need a new Tags or Categories, send us an email{' '}
									{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}!
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Current Promotions</CardTitle>
								<CardDescription>
									Do you have any current promotions? If not, leave it empty.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="discount_code"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Discount Code</FormLabel>
											<FormDescription>
												What is the discount code? (e.g. FIRSTORDER)
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
									name="discount_code_percentage"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Discount Code Percentage</FormLabel>
											<FormDescription>
												What is the discount code percentage? (e.g. 30)
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
									name="discount_code_text"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Discount Code Text</FormLabel>
											<FormDescription>
												A little explainer text in regards to who and how one
												can redeem the code. (e.g. &quot;Use code
												&apos;FIRSTORDER&apos; to get this discount on orders of
												$100 or more&quot;)
											</FormDescription>
											<FormControl>
												<Textarea {...field} rows={3} />
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
									Choose where your listing will be linked to.
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
													url={listing?.default_image_url || field.value}
													width={900}
													height={600}
													database="listing_images"
													onUpload={(url: string) => {
														setValue('default_image_url', url, {
															shouldValidate: true,
															shouldDirty: true,
															shouldTouch: true,
														});
													}}
												/>
											</FormControl>
											<Button
												className="text-xs text-foreground dark:text-white italic mt-2 mb-4"
												variant="link"
												type="button"
												size="sm"
												onClick={() => {
													setValue('default_image_url', '', {
														shouldValidate: true,
														shouldDirty: true,
														shouldTouch: true,
													});
												}}
											>
												Delete Cover Image
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="logo_image_url"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Logo</FormLabel>

											<FormControl>
												<SupabaseImageUploadArea
													uid={userId}
													url={listing?.logo_image_url || field.value}
													width={256}
													height={128}
													database="listing_images"
													onUpload={(url: string) => {
														setValue('logo_image_url', url, {
															shouldValidate: true,
															shouldDirty: true,
															shouldTouch: true,
														});
													}}
												/>
											</FormControl>
											<Button
												className="text-xs text-foreground dark:text-white italic mt-2 mb-4"
												variant="link"
												type="button"
												size="sm"
												onClick={() => {
													setValue('logo_image_url', '', {
														shouldValidate: true,
														shouldDirty: true,
														shouldTouch: true,
													});
												}}
											>
												Delete Logo
											</Button>

											<FormMessage />
										</FormItem>
									)}
								/>

								{listing && listing.is_admin_published && (
									<>
										<CardTitle className="pt-6">Feature Badge</CardTitle>
										<CardDescription>
											Download our Badge and show that you are featured on our
											website! You can link to: <br /> <br />
											<span className="italic">{`${COMPANY_BASIC_INFORMATION.URL}/explore/${listing.slug}`}</span>
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
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Slug</FormLabel>
											<FormDescription>
												This is the slug of your listing.
											</FormDescription>
											<FormControl>
												<Input
													placeholder={field.value
														.toString()
														.replace(/[\W_]+/g, ' ')
														.split(' ')
														.join('-')
														.toLowerCase()}
													value={field.value
														.toString()
														.replace(/[\W_]+/g, ' ')
														.split(' ')
														.join('-')
														.toLowerCase()}
													disabled
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
								{listing && (
									<>
										<FormItem>
											<FormLabel>Listing ID</FormLabel>
											<Input value={listing.id} disabled />
										</FormItem>
										<FormItem>
											<FormLabel>Views</FormLabel>
											<Input value={listing.views ?? 0} disabled />
										</FormItem>
										<FormItem>
											<FormLabel>Likes</FormLabel>
											<Input value={listing.likes ?? 0} disabled />
										</FormItem>
										<FormItem>
											<FormLabel>Clicks</FormLabel>
											<Input value={listing.clicks ?? 0} disabled />
										</FormItem>
										<FormItem className="grid pt-2">
											<FormLabel>Admin Approval</FormLabel>
											<FormDescription>
												Once you publish, our admins will review your listing.
											</FormDescription>
											<Switch
												checked={listing.is_admin_published ?? false}
												disabled
											/>
										</FormItem>
										<FormItem className="grid pt-2">
											<FormLabel>Is Promoted</FormLabel>
											<FormDescription>
												(Send an email to{' '}
												{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL} if you wish to
												promote this listing.)
											</FormDescription>
											<Switch checked={listing.is_promoted ?? false} disabled />
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
