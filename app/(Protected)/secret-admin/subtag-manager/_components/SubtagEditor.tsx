'use client';

// Import Types
import { FullSubtagType, SubtagGroupType } from '@/supabase-special-types';
// Import External Packages
import EmojiPicker from 'emoji-picker-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// Import Components
import SupabaseImageUploadArea from '@/components/SupabaseImageUploadArea';
import { Popover, PopoverTrigger, PopoverContent } from '@/ui/Popover';
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
import { Textarea } from '@/ui/Textarea';
import { TagSelect } from '@/ui/TagSelect';
// Import Functions & Actions & Hooks & State
import getSubtagDescriptionWithAi from '@/actions/subtags/getSubtagDescriptionWithAi';
import { arraysEqual, cn } from '@/lib/utils';
import { toast } from '@/lib/useToaster';
import upsertSubtag from '@/actions/subtags/upsertSubtag';
// Import Data
// Import Assets & Icons
import { SparklesIcon } from 'lucide-react';

const SubtagFormSchema = z.object({
	id: z.optional(z.string()),
	name: z.string().min(2, { message: 'Be at least 2 characters long' }),
	headline: z
		.string()
		.min(10, { message: 'Be at least 10 characters long' })
		.max(60, { message: 'Be at most 60 characters long' }),
	description: z
		.string()
		.min(10, { message: 'Be at least 10 characters long' })
		.max(160, { message: 'Be at most 160 characters long' }),
	image_url_hero: z.optional(z.string()),
	image_url_small: z.optional(z.string()),
	emoji: z.optional(z.string()),
	href: z.optional(z.string()),
	color: z.optional(z.string()),
});

export default function SubtagEditor({
	subtag,
	subtagGroups,
}: {
	subtag: FullSubtagType | undefined;
	subtagGroups: SubtagGroupType[];
}) {
	const router = useRouter();

	const [selectedSubtagGroups, setSelectedSubtagGroups] = useState<
		SubtagGroupType[]
	>(subtag?.subtag_groups ?? []);

	const form = useForm<z.infer<typeof SubtagFormSchema>>({
		resolver: zodResolver(SubtagFormSchema),
		defaultValues: {
			id: subtag?.id || '',
			name: subtag?.name || '',
			headline: subtag?.headline || '',
			description: subtag?.description || '',
			image_url_hero: subtag?.image_url_hero || '',
			image_url_small: subtag?.image_url_small || '',
			emoji: subtag?.emoji || '',
			href: subtag?.href || '',
			color: subtag?.color || '',
		},
	});

	// Handle subtag group changes
	const handleSubtagGroupChange = (value: { name: string }[]) => {
		const enrichedValue = value
			.map((subtag) => {
				const tempSubtag = subtagGroups.find(
					(subtagGroup) => subtagGroup.name === subtag.name
				);
				return { id: tempSubtag?.id, name: subtag.name };
			})
			.filter(Boolean) as SubtagGroupType[];

		setSelectedSubtagGroups(enrichedValue);
	};

	const [aiIsLoading, setAiIsLoading] = useState<boolean>(false);
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
	const [colorPreview, setColorPreview] = useState<string | undefined | null>(
		subtag?.color
	);

	const {
		formState: { isDirty, isSubmitting },
		setValue,
		watch,
	} = form;

	const handleSubtagAI = async () => {
		const subtagName = watch('name');
		setAiIsLoading(true);
		if (!subtagName) {
			setAiIsLoading(false);
			return null;
		}
		const aiData = await getSubtagDescriptionWithAi(subtagName);
		if (!aiData.success) {
			console.error(aiData.error);
			setAiIsLoading(false);
			return null;
		}

		setValue('description', aiData.data.description, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});

		setValue('headline', aiData.data.headline, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});

		setAiIsLoading(false);
	};

	async function onSubmit(values: z.infer<typeof SubtagFormSchema>) {
		let subtagGroupIds = selectedSubtagGroups
			.map((subtagGroup) => {
				const existingSubtag = subtagGroups.find(
					(groupChoice) => groupChoice.name === subtagGroup.name
				);
				if (existingSubtag) {
					return existingSubtag.id;
				} else {
					return null;
				}
			})
			.filter((subtagId) => subtagId !== null) as string[];
		await upsertSubtag(values, subtagGroupIds)
			.then(async (response) => {
				if (!response.success) {
					toast({
						title: 'Error',
						description: `There was an error ${
							subtag ? 'updating' : 'creating'
						} your subtag: ${response.error}`,
					});
				} else {
					toast({
						title: 'Success',
						description: `Your subtag has been ${
							subtag ? 'updated!' : 'created!'
						}.`,
					});
					router.push('/secret-admin/subtag-manager');
				}
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: `There was an error ${
						subtag ? 'updating' : 'creating'
					} your subtag: ${err}`,
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
								onClick={() => router.push('/secret-admin/subtag-manager')}
								variant="outline"
								disabled={isSubmitting}
							>
								Discard
							</Button>
							<Button
								type="submit"
								disabled={
									(!isDirty &&
										(subtag?.subtag_groups
											? arraysEqual(subtag?.subtag_groups, selectedSubtagGroups)
											: selectedSubtagGroups.length === 0)) ||
									isSubmitting
								}
								data-umami-event={
									subtag ? 'Button Subtag Update' : 'Button Subtag Create'
								}
							>
								{subtag ? 'Update' : 'Create'}
							</Button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card className="row-span-3">
						<CardHeader>
							<CardTitle>Subtag Descriptives</CardTitle>
							<CardDescription>
								Provide the details of your subtag.
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
											The name of your subtag campaign.
										</FormDescription>
										<FormControl>
											<Input id="nameinput" placeholder="Name" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								variant="outline"
								type="button"
								size="lg"
								onClick={async () => await handleSubtagAI()}
								disabled={!watch('name') || aiIsLoading}
							>
								<SparklesIcon size={18} className="mr-2 stroke-2" />
								{aiIsLoading
									? 'Loading..'
									: 'Generate AI Headline & Description'}
							</Button>

							<FormField
								control={form.control}
								name="headline"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Headline</FormLabel>
										<FormDescription>
											Required, max 60 characters
										</FormDescription>
										<FormControl>
											<Input placeholder="Headline" {...field} />
										</FormControl>
										<p
											className={cn(
												'text-xs italic float-right text-muted-foreground mr-1',
												field.value.length > 60 && 'text-red-600'
											)}
										>{`${field.value.length} / 60`}</p>

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
											Required, max 160 characters
										</FormDescription>

										<FormControl>
											<Textarea placeholder="Description" rows={4} {...field} />
										</FormControl>
										<p
											className={cn(
												'text-xs italic float-right text-muted-foreground mr-1',
												field.value.length > 160 && 'text-red-600'
											)}
										>{`${field.value.length} / 160`}</p>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="href"
								render={({ field }) => (
									<FormItem>
										<FormLabel>URL</FormLabel>
										<FormDescription>
											Optional, external URL, will be used oly when a component
											is used that uses this URL. Default: not used. Enter full
											URL with https://
										</FormDescription>
										<FormControl>
											<Input placeholder="https://" type="url" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<TagSelect
								updaterFunction={handleSubtagGroupChange}
								possibleTags={subtagGroups as { name: string }[]}
								selectedTags={
									subtag
										? (subtag.subtag_groups as { name: string }[]) || undefined
										: null
								}
								label="Subtag Groups"
								placeholder="Add Subtag Groups"
								whatIsSelected="Options"
								description="Select the subtag groups this subtag should be associated with."
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Subtag Visuals</CardTitle>
							<CardDescription>
								Make your subtags POP by adding some visuals. Read the docs to
								understand where which visual is used.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<FormField
								control={form.control}
								name="emoji"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Emoji</FormLabel>
										<FormDescription>
											Optional, single emoji, will be displayed above the subtag
											name.
										</FormDescription>
										<div className="flex gap-x-4">
											<FormControl>
												<Input placeholder="Emoji" {...field} />
											</FormControl>
											<Popover
												open={isEmojiPickerOpen}
												onOpenChange={setIsEmojiPickerOpen}
											>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={'outline'}
															className={cn('pl-3 text-left font-normal')}
														>
															🔍
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<EmojiPicker
														open={true}
														reactionsDefaultOpen={false}
														onEmojiClick={(e) => {
															setValue('emoji', e.emoji, {
																shouldValidate: true,
																shouldDirty: true,
																shouldTouch: true,
															});
															setIsEmojiPickerOpen(false);
														}}
														height={400}
													/>
												</PopoverContent>
											</Popover>
										</div>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="image_url_hero"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Hero Image</FormLabel>
										<FormDescription>
											Optional, 16x5 aspect ratio, e.g. 1600px x 500, displayed
											on the /subtag/YOUR_TAG_SLUG page. When no image is
											provided, the above color will be used as background. If
											no color is set, the default image will be used.
										</FormDescription>

										<FormControl>
											<SupabaseImageUploadArea
												uid={'cattag_image_upload'}
												url={
													field.value !== undefined
														? field.value
														: subtag?.image_url_hero
												}
												width={800}
												height={250}
												database="cattag_images"
												onUpload={(url: string) => {
													setValue('image_url_hero', url, {
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
												setValue('image_url_hero', '', {
													shouldValidate: true,
													shouldDirty: true,
													shouldTouch: true,
												});
											}}
										>
											Delete Hero Image
										</Button>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="image_url_small"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Small Image</FormLabel>
										<FormDescription>
											Optional, 1x1 aspect ratio, e.g. 256px x 256px, displayed
											on the /subtag page. Will only be used when corresponding
											component is used somewhere. Default: not used{' '}
										</FormDescription>
										<FormControl>
											<SupabaseImageUploadArea
												uid={'cattag_image_upload'}
												url={subtag?.image_url_small || field.value}
												width={128}
												height={128}
												database="cattag_images"
												onUpload={(url: string) => {
													setValue('image_url_small', url, {
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
												setValue('image_url_small', '', {
													shouldValidate: true,
													shouldDirty: true,
													shouldTouch: true,
												});
											}}
										>
											Delete Small Image
										</Button>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Choose a color</FormLabel>
										<FormDescription>
											Optional. Will be used as background color for the hero
											section when no Hero Image is provided. When no Hero Image
											and no Color is set, the default image will be used.
										</FormDescription>
										<FormControl>
											<div className="flex items-center space-x-2">
												<Input
													type="color"
													{...field}
													value={field.value || '#000000'}
													onChange={(e) => {
														field.onChange(e.target.value);
														setColorPreview(e.target.value);
													}}
													className="w-12 p-1 rounded-md"
												/>
												<Input
													type="text"
													{...field}
													value={field.value || ''}
													onChange={(e) => {
														field.onChange(e.target.value);
														setColorPreview(e.target.value);
													}}
													placeholder="Enter a color value"
													className="flex-grow"
												/>
												<Button
													type="button"
													variant="outline"
													onClick={() => {
														setValue('color', undefined, {
															shouldValidate: true,
															shouldDirty: true,
															shouldTouch: true,
														});
														setColorPreview(subtag?.color);
													}}
												>
													Reset
												</Button>
												<Button
													type="button"
													variant="outline"
													onClick={() => {
														setValue('color', '', {
															shouldValidate: true,
															shouldDirty: true,
															shouldTouch: true,
														});
														setColorPreview('transparent');
													}}
												>
													Delete
												</Button>
											</div>
										</FormControl>
										<FormDescription>
											Enter a color value or use the color picker. Please see
											the default text color on your chosen color and make sure
											it is readable:
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div
								className={cn(
									'h-24 rounded-md content-center',
									colorPreview === '#ffffff' && 'border border-gray-300'
								)}
								style={{ backgroundColor: colorPreview || 'transparent' }}
								aria-label="Color preview"
							>
								{colorPreview && colorPreview !== 'transparent' && (
									<p className="text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.6)] text-center">
										{subtag?.name || 'Category Name'}
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</form>
		</Form>
	);
}
