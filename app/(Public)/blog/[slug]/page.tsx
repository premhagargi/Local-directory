// Import Types
// Import External Packages
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
// Import Components
import TableOfContents_MDX from '@/components/blog/TableOfContents_MDX';
import Button_BackToTop from '@/components/Button_BackToTop';
import DocNavigation from '@/components/blog/DocNavigation';
import AuthorInfo from '@/components/blog/AuthorInfo';
import DateInfo from '@/components/blog/DateInfo';
import SupabaseImage from '@/components/SupabaseImage';
import Breadcrumps from '@/ui/Breadcrumps';
import AdSlot from '@/components/ads/AdSlot';
import {
	SubSectionOuterContainer,
	SubSectionInnerContainer,
	SectionOuterContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import createMetaData from '@/lib/createMetaData';
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { getPublishedPostBySlug } from '@/actions/blog/getPublishedPostBySlug';
import { getAllSlugsFromPublishedPosts } from '@/actions/blog/getAllSlugsFromPublishedPosts';
// Import Data
import { useMDXComponents } from '@/mdx-components';
import { CUSTOM_MDX_COMPONENTS } from '@/components/blog/CustomMDXComponents';
import { COMPANY_BASIC_INFORMATION } from '@/constants';

// Import Assets & Icons

type BlogPostPageProps = {
	params: { slug: string };
};

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params

export async function generateStaticParams(): Promise<BlogPostPageProps[]> {
	const { data: unformattedSlugs } = await getAllSlugsFromPublishedPosts();

	const slugs: BlogPostPageProps[] = unformattedSlugs.map((slugObject) => {
		return {
			params: {
				slug: slugObject.slug,
			},
		};
	});

	return slugs;
}

// https://nextjs.org/docs/app/building-your-application/optimizing/metadata

export async function generateMetadata({ params }: BlogPostPageProps) {
	const { data: post } = await getPublishedPostBySlug(params.slug);

	if (!post || !('id' in post)) {
		return createMetaData({
			customTitle: 'Blog Post',
		});
	}

	const supabase = createSupabaseBrowserClient();
	let ogImageUrl = '';
	if (post.default_image_url) {
		const publicUrlLocation = supabase.storage
			.from('blog_images')
			.getPublicUrl(post.default_image_url);
		ogImageUrl = publicUrlLocation.data?.publicUrl ?? '';
	}

	return createMetaData({
		customTitle: post.title,
		customDescription: post.description,
		customTags: post.keywords ?? [],
		customImages:
			ogImageUrl && ogImageUrl !== ''
				? [
						{
							url: ogImageUrl,
							alt: `Image of ${post.title} on ${COMPANY_BASIC_INFORMATION.NAME}`,
							type: 'image',
							width: 900,
							height: 600,
						},
				  ]
				: undefined,
		customSlug: `blog/${post.slug}`,
	});
}

export default async function BlogOverviewPage({ params }: BlogPostPageProps) {
	const { data: post } = await getPublishedPostBySlug(params.slug);

	if (!('id' in post)) return notFound();

	post.content = `# ${post.title}\n${post.content}`;

	return (
		<SectionOuterContainer className="max-w-6xl">
			<SubSectionOuterContainer>
				<Breadcrumps />
				<SubSectionInnerContainer>
					<div className="grid md:flex flex-row w-full relative gap-x-4 md:gap-x-8">
						<div className="w-full mx-auto max-w-5xl">
							<article className="bg-white dark:bg-black dark:border dark:border-white rounded-md drop-shadow-xl ">
								<SupabaseImage
									dbImageUrl={post.default_image_url}
									imageAlt={post.title}
									width={1200}
									height={630}
									className="w-full object-cover h-auto rounded-t-md"
									database="blog_images"
									priority
								/>
								<div
									className="prose mx-auto dark:prose-invert py-6 px-4"
									style={{ maxWidth: '80ch' }}
								>
									<MDXRemote
										source={post.content}
										components={{
											...CUSTOM_MDX_COMPONENTS,
											...(useMDXComponents || {}),
										}}
									/>
								</div>
							</article>
							<DocNavigation
								previousTitle="Previous Blog Post"
								nextTitle="Next Blog Post"
								previousLink={undefined}
								nextLink={undefined}
							/>
						</div>

						<div className="order-first md:order-none w-60">
							<AuthorInfo author={post.author} />
							<DateInfo
								createDate={
									post.published_at ? new Date(post.published_at) : new Date()
								}
							/>
							<AdSlot slot="blog-1" className="mt-0 mb-4" />

							<TableOfContents_MDX mdxContent={post.content} />
						</div>
					</div>

					<Button_BackToTop />
				</SubSectionInnerContainer>
				<AdSlot slot="blog-3" className="mt-0" />
			</SubSectionOuterContainer>
		</SectionOuterContainer>
	);
}
