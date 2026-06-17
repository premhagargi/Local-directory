'use client';

// Import Types
import { TopicType } from '@/supabase-special-types';
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
import insertActivity from '@/actions/activites/insertActivity';
import upsertBlogPost from '@/actions/blog/upsertBlogPost';
import generateBlogPostWithAi from '@/actions/blog/generateBlogPostWithAi';
import { toast } from '@/lib/useToaster';
// Import Data
import {
	COMPANY_BASIC_INFORMATION,
	DEFAULT_IMAGE_OPTIONS,
	GENERAL_SETTINGS,
} from '@/constants';
// Import Assets & Icons
import { LoaderCircleIcon } from 'lucide-react';

const BlogPostFormSchema = z.object({
	id: z.optional(z.string()),
	title: z.string().min(2, { message: 'Should at least 2 characters long' }),
	description: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
	topic_id: z.string().min(2, { message: 'Category is missing.' }),
	content: z
		.string()
		.min(100, { message: 'Should be at least 100 characters long' }),
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
	is_admin_approved: z.boolean().nullable(),
	keywords: z.string().optional(),
	published_at: z.string(),
});

const mdParser = new MarkdownIt();

export default function BlogPostEditor({
	post,
	topicChoices,
	userId,
	isSuperAdmin,
}: {
	post: Tables<'blog_posts'> | undefined;
	topicChoices: TopicType[];
	userId: Tables<'users'>['id'];
	isSuperAdmin: boolean;
}) {
	const [aiGenerated, setAiGenerated] = useState(false);
	const [reloaded, setReloaded] = useState(false);
	const Router = useRouter();

	const form = useForm<z.infer<typeof BlogPostFormSchema>>({
		resolver: zodResolver(BlogPostFormSchema),
		defaultValues: {
			id: post?.id ?? '',
			title: post?.title ?? '',
			description: post?.description ?? '',
			content: post?.content ?? '',
			topic_id: post?.topic_id ?? '',
			is_user_published: post?.is_user_published ?? false,
			is_admin_approved: post?.is_admin_approved ?? false,
			default_image_url: post?.default_image_url ?? '',
			keywords: post?.keywords ? post.keywords.join(', ') : '',
			published_at: post?.published_at
				? post.published_at
				: new Date().toISOString().slice(0, 10),
		},
	});

	const {
		formState: { isDirty, isSubmitting },
		setValue,
		watch,
	} = form;

	const handleAiButton = async (title: string) => {
		if (!title) {
			toast({
				title: 'Error',
				description: 'The title is missing.',
			});
			setAiGenerated(false);
			return null;
		}

		const aiDescription = await generateBlogPostWithAi(title);

		if (!aiDescription || aiDescription.error) {
			toast({
				title: 'Error',
				description:
					'There was an error generating the AI description. Please try again.',
			});
			setAiGenerated(false);
			return null;
		}
		setValue('content', aiDescription.data.content, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
		setAiGenerated(false);
		toast({
			title: 'Success',
			description: 'Your post has been updated.',
		});
	};

	async function onSubmit(values: z.infer<typeof BlogPostFormSchema>) {
		await upsertBlogPost(values)
			.then(async (response) => {
				if (!response.success) {
					toast({
						title: 'Error',
						description: `There was an error ${
							post ? 'updating' : 'creating'
						} your post: ${response.error}`,
					});
				} else {
					toast({
						title: 'Success',
						description: `Your post has been ${
							post ? 'updated!' : 'created!'
						}.`,
					});
					await insertActivity(post ? 'update_post' : 'new_post', values.title);
					Router.push('/account/posts');
				}
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: `There was an error ${
						post ? 'updating' : 'creating'
					} your post: ${err}`,
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
								onClick={() => Router.push('/account/posts')}
								variant="outline"
								disabled={isSubmitting}
							>
								Discard
							</Button>
							<Button
								type="submit"
								disabled={!isDirty || isSubmitting}
								data-umami-event={
									post ? 'Button Post Update' : 'Button Post Create'
								}
							>
								{post ? 'Update' : 'Create'}
							</Button>
							{post && (
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

				<div className="flex flex-wrap md:grid md:grid-cols-3 gap-y-4 md:gap-x-4">
					<Card className="md:row-span-2 md:col-span-2">
						<CardHeader>
							<CardTitle>Content</CardTitle>
							<CardDescription>
								This is the main content of your post. Make it interesting!{' '}
								<br />
								<br />
								The title of your post will be: <br />
								<span className="text-lg font-bold">{watch('title')}</span>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										{GENERAL_SETTINGS.USE_AI_CONTENT_CREATION &&
											isSuperAdmin && (
												<Button
													type="button"
													onClick={(e) => {
														e.preventDefault();
														setAiGenerated(true);
														handleAiButton(watch('title'));
													}}
													variant="outline"
													disabled={
														isSubmitting ||
														aiGenerated ||
														!watch('title') ||
														watch('title').length < 10
													}
													data-umami-event="Button AI Content"
													data-umami-event-userid={userId}
												>
													<span className="text-wrap">
														Generate Content with AI (based on title)
													</span>{' '}
													{aiGenerated && (
														<LoaderCircleIcon className="ml-1 animate-spin" />
													)}
												</Button>
											)}
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
						</CardContent>
					</Card>

					<Card className="row-span-1 col-span-1">
						<CardHeader>
							<CardTitle>Publish</CardTitle>
							<CardDescription>
								You blog post is currently in the{' '}
								<span className="font-semibold">
									{post?.is_user_published ? 'published' : 'draft'}
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
											{post?.is_user_published ? 'Deactivate: ' : 'Activate: '}
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
							<FormField
								control={form.control}
								name="published_at"
								render={({ field }) => (
									<FormItem>
										<FormLabel>(Likely) Publish Date:</FormLabel>

										<FormControl>
											<Input
												type="date"
												placeholder="Publish Date"
												required
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{isSuperAdmin && (
								<FormField
									control={form.control}
									name="is_admin_approved"
									render={({ field }) => (
										<FormItem className="inline-flex space-y-0 h-10 items-center space-x-4">
											<FormLabel>
												{' '}
												{post?.is_admin_approved
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
							<CardTitle>Descriptions</CardTitle>
							<CardDescription>
								Let people know what your blog post is about.
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
											This is the public title of your post. Will be used as the
											OpenGraph title as well as the h1 header.
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
											This is the meta description of your post. Will be used in
											previews. Max 160 characters.
										</FormDescription>
										<FormControl>
											<Textarea rows={5} placeholder="Description" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="topic_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topic</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} {...field}>
												<SelectTrigger>
													<SelectValue placeholder="Choose the best fitting Topic" />
												</SelectTrigger>

												<SelectContent>
													{topicChoices.map((topic) => (
														<SelectItem key={topic.id} value={topic.id}>
															{topic.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormDescription>
											The main topic of your blog post. Choose wisely.
										</FormDescription>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="keywords"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Keywords</FormLabel>
										<FormControl>
											<Input placeholder="Keywords" {...field} />
										</FormControl>
										<FormDescription>
											Keywords are important for SEO. Separate them with commas.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<Card className="col-span-2">
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
												url={field.value || post?.default_image_url}
												width={900}
												height={600}
												database="blog_images"
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
							<p className="py-2">or choose a standard pic:</p>

							<div className="flex flex-wrap justify-between gap-2 md:px-8">
								{DEFAULT_IMAGE_OPTIONS.map((image) => (
									<div
										key={image.localHref}
										onClick={() =>
											setValue('default_image_url', image.nameInDB, {
												shouldValidate: true,
												shouldDirty: true,
												shouldTouch: true,
											})
										}
									>
										<Image
											src={image.localHref}
											alt="Default Pic"
											width={90}
											height={60}
											className="w-28 h-20 cursor-pointer hover:opacity-80"
										/>
									</div>
								))}
							</div>
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
											This is the slug of your blog post.
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
							{post && (
								<>
									<FormItem>
										<FormLabel>Post ID</FormLabel>
										<Input value={post.id} disabled />
									</FormItem>
									<FormItem>
										<FormLabel>Created</FormLabel>
										<Input value={post.created_at ?? ''} disabled />
									</FormItem>
									<FormItem>
										<FormLabel>Updated</FormLabel>
										<Input value={post.updated_at ?? ''} disabled />
									</FormItem>
									<FormItem className="grid pt-2">
										<FormLabel>Admin Approval</FormLabel>
										<FormDescription>
											Once you publish, our admins will review your blog post.
										</FormDescription>
										<Switch
											checked={post.is_admin_approved ?? false}
											disabled
										/>
									</FormItem>
									<FormItem className="grid pt-2">
										<FormLabel>Is Sponsored</FormLabel>
										<FormDescription>
											(Send an email to{' '}
											{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL} if you wish to
											publish a sponsored post.)
										</FormDescription>
										<Switch checked={post.is_sponsored ?? false} disabled />
									</FormItem>
								</>
							)}
						</CardContent>
					</Card>
				</div>
			</form>
		</Form>
	);
}
