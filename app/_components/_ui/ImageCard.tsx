// Import Types
import * as React from 'react';
// Import External Packages
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
// Import Components
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

interface CustomLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	as?: string;
	replace?: boolean;
	scroll?: boolean;
	shallow?: boolean;
	prefetch?: boolean;
	locale?: string | false;
	children?: React.ReactNode;
	linkType?: 'internal' | 'external';
}

const ImageCard = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { linkHover?: boolean }
>(({ className, linkHover, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'group relative rounded-xl border shadow-md border-transparent bg-card text-card-foreground ',
			linkHover &&
				'transition-colors ease-in hover:border-neutral-400 dark:hover:border-neutral-500',
			className
		)}
		{...props}
	/>
));
ImageCard.displayName = 'ImageCard';

const ImageCardPrice = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		priceWas?: number;
		priceNow?: number;
		currencySymbol?: string;
		priceText?: string;
	}
>(
	(
		{ className, priceWas, priceNow, currencySymbol, priceText, ...props },
		ref
	) => (
		<div
			ref={ref}
			className={cn('absolute right-4 top-4', className)}
			{...props}
		>
			<div className="flex p-2 bg-white bg-opacity-20 dark:bg-opacity-50 backdrop-blur-lg rounded-full">
				{priceText ? (
					<p className="text-foreground dark:text-foreground font-semibold text-lg">
						{priceText}
					</p>
				) : (
					<>
						{priceWas && (
							<p className="line-through text-sm mr-2 dark:text-foreground">
								{currencySymbol || '$'}
								{priceWas}
							</p>
						)}

						<p className="text-foreground dark:text-foreground font-semibold text-lg">
							{currencySymbol || '$'}
							{priceNow}
						</p>
					</>
				)}
			</div>
		</div>
	)
);
ImageCardPrice.displayName = 'ImageCardPrice';

const ImageCardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			'text-base md:text-xl font-semibold leading-none tracking-tight',
			className
		)}
		{...props}
	/>
));
ImageCardTitle.displayName = 'ImageCardTitle';

const ImageCardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(
			'text-sm text-muted-foreground text-justify line-clamp-3',
			className
		)}
		{...props}
	/>
));
ImageCardDescription.displayName = 'ImageCardDescription';

const ImageCardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('p-4 ', className)} {...props} />
));
ImageCardFooter.displayName = 'ImageCardFooter';

const ImageCardImageContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'aspect-video w-full rounded-t-xl overflow-hidden relative flex items-center justify-center',
			className
		)}
		{...props}
	/>
));
ImageCardImageContainer.displayName = 'ImageCardImageContainer';

interface CustomBannerProps extends React.HTMLAttributes<HTMLDivElement> {
	location?: 'tl' | 'bl' | 'tr' | 'br';
	onlyOnHover?: boolean;
}

const ImageCardBanner = React.forwardRef<HTMLDivElement, CustomBannerProps>(
	({ className, location, onlyOnHover, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				'absolute z-20',
				className,
				location === 'tl' && 'top-2 left-2',
				location === 'bl' && 'bottom-2 left-2',
				location === 'tr' && 'top-2 right-2',
				location === 'br' && 'bottom-2 right-2',
				onlyOnHover && 'group-hover:opacity-100 opacity-0'
			)}
			{...props}
		/>
	)
);
ImageCardBanner.displayName = 'ImageCardBanner';

const ImageCardTagGroup = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		tags: { name: string }[];
	}
>(({ className, tags }, ref) => (
	<div className="flex items-center gap-x-4 text-xs py-0.5" ref={ref}>
		<div className="flex gap-1 flex-wrap">
			{tags?.map((tag) => (
				<span
					key={tag.name}
					className={cn(
						'relative inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground whitespace-nowrap',
						className
					)}
				>
					{tag.name}
				</span>
			))}
		</div>
	</div>
));
ImageCardTagGroup.displayName = 'ImageCardTagGroup';

const ImageCardImage = React.forwardRef<HTMLImageElement, ImageProps>(
	({ className, width, src, height, alt, loading, ...props }, ref) => (
		<Image
			className={cn(
				'w-4/5 h-4/5 absolute object-contain bg-no-repeat mx-auto',
				className
			)}
			alt={alt}
			src={src}
			width={width}
			height={height}
			loading={loading}
			{...props}
			priority
		/>
	)
);
ImageCardImage.displayName = 'ImageCardImage';

const ImageCardBlurryImage = React.forwardRef<HTMLImageElement, ImageProps>(
	({ className, width, src, height, alt, loading, ...props }, ref) => (
		<Image
			className={cn(
				'object-cover absolute scale-150 filter blur-md contrast-200 brightness-75',
				className
			)}
			alt={alt}
			src={src}
			width={width}
			height={height}
			loading={loading}
			{...props}
		/>
	)
);
ImageCardBlurryImage.displayName = 'ImageCardBlurryImage';

interface CustomVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
	src: string;
	className?: string;
}

const ImageCardVideo = React.forwardRef<HTMLVideoElement, CustomVideoProps>(
	({ className, src, ...props }, ref) => (
		<video
			autoPlay={true}
			loop={true}
			src={src}
			className={cn(
				'w-4/5 h-4/5 absolute object-contain bg-no-repeat mx-auto',
				className
			)}
			{...props}
			ref={ref}
		/>
	)
);
ImageCardVideo.displayName = 'ImageCardVideo';

const ImageCardLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
	(
		{
			className,
			children,
			href,
			as,
			replace,
			scroll,
			shallow,
			prefetch,
			locale,
			linkType = 'internal',
			...anchorProps
		},
		ref
	) =>
		linkType === 'external' ? (
			<a
				className={cn('absolute inset-0', className)}
				href={href}
				{...anchorProps}
			>
				<span className="sr-only">External link to {href}</span>
				{children}
			</a>
		) : (
			<Link
				className={cn('absolute inset-0', className)}
				href={href}
				as={as}
				replace={replace}
				scroll={scroll}
				shallow={shallow}
				prefetch={prefetch}
				locale={locale}
				{...anchorProps}
			>
				<span className="sr-only">Internal link to {href}</span>
				{children}
			</Link>
		)
);
ImageCardLink.displayName = 'ImageCardLink';

export {
	ImageCard,
	ImageCardImageContainer,
	ImageCardBlurryImage,
	ImageCardImage,
	ImageCardFooter,
	ImageCardTitle,
	ImageCardDescription,
	ImageCardLink,
	ImageCardPrice,
	ImageCardVideo,
	ImageCardBanner,
	ImageCardTagGroup,
};
