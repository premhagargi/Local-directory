// Import Types
import { Metadata } from 'next/types';
// Import External Packages
// Import Components
import Button_BackToTop from '@/components/Button_BackToTop';
import SupabaseImage from '@/components/SupabaseImage';
import Breadcrumps from '@/ui/Breadcrumps';
import { Badge } from '@/ui/Badge';
import {
	SubSectionOuterContainer,
	SubSectionInnerContainer,
	SectionOuterContainer,
	SectionTitle,
	SectionDescription,
} from '@/ui/Section';
import {
	ImageCard,
	ImageCardImageContainer,
	ImageCardFooter,
	ImageCardLink,
	ImageCardTitle,
	ImageCardDescription,
} from '@/ui/ImageCard';
// Import Functions & Actions & Hooks & State
import { getPublishedPosts } from '@/actions/blog/getPublishedPosts';
import createMetaData from '@/lib/createMetaData';
import { formatDate } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons

export const metadata: Metadata = createMetaData({
	customTitle: 'Blog',
	customDescription: `Get the latest news about ${COMPANY_BASIC_INFORMATION.NAME}, the newest listings, the hottest services, our company, and our mission and vision.`,
	customSlug: `blog`,
});

export default async function BlogOverviewPage() {
	const { data: blogPosts } = await getPublishedPosts();
	return (
		<SectionOuterContainer className="max-w-4xl px-4">
			<Breadcrumps />
			<SectionTitle>Blog</SectionTitle>
			<SectionDescription>
				Get the latest news about {COMPANY_BASIC_INFORMATION.NAME}, and the
				latest listings.
			</SectionDescription>
			<SubSectionOuterContainer className="py-0">
				<SubSectionInnerContainer className="max-w-7xl items-start">
					{blogPosts.length === 0 && (
						<p className="text-lg font-semibold">
							Stay tuned! We are crafting our first blog!
						</p>
					)}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative">
						{blogPosts.map((post) => (
							<ImageCard key={post.id} linkHover>
								<ImageCardImageContainer>
									<SupabaseImage
										dbImageUrl={post.default_image_url}
										imageAlt={post.title}
										width={400}
										height={300}
										className="h-full w-full object-cover"
										database="blog_images"
										priority
									/>
								</ImageCardImageContainer>
								<ImageCardFooter className="grid space-y-2">
									<ImageCardLink href={`/blog/${post.slug}`} />
									<Badge variant="outline" className="w-fit">
										{formatDate(new Date(post.published_at!) ?? new Date())}
									</Badge>
									<ImageCardTitle>{post.title}</ImageCardTitle>
									<ImageCardDescription>
										{post.description}
									</ImageCardDescription>
								</ImageCardFooter>
							</ImageCard>
						))}
					</div>
					<Button_BackToTop />
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>
		</SectionOuterContainer>
	);
}
