// Import Types
// Import External Packages
// Import Components
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/ui/Tooltip';
import { buttonVariants } from '@/ui/Button';
import ExternalLink from '@/ui/ExternalLink';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
import { Icons } from '@/ui/Icons';
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Data
// Import Assets & Icons

type SocialLinksProps = {
	currentSiteLink: string;
	title?: string;
	direction?: 'horizontal' | 'vertical';
	size?: 'sm' | 'lg';
	className?: string;
	asButton?: boolean;
	asChild?: boolean;
};

export const SOCIAL_SHARE_LINKS = [
	{
		channelName: 'X',
		channelHref: 'https://twitter.com/intent/tweet?text=',
		Icon: Icons.X,
		shareTextInFrontOfURL: `I found this on ${COMPANY_BASIC_INFORMATION.NAME}: `,
	},
	{
		channelName: 'facebook',
		channelHref: 'https://www.facebook.com/sharer/sharer.php?u=',
		Icon: Icons.Facebook,
		shareTextInFrontOfURL: '',
	},
];

/**
 * Renders a social share bar component.
 *
 * @param currentSiteLink - The link to the current site.
 * @param title='Share' - The title of the social share bar.
 * @param SOCIAL_SHARE_LINKS - The array of social share links.
 * @param direction='horizontal' - The direction of the social share bar (horizontal or vertical).
 * @param size='sm' - The size of the social share icons (sm or lg).
 * @param className - The additional CSS class name for the social share bar.
 * @param asButton=true - Whether to render the social share links as buttons.
 * @param asChild=false - Whether to render the social share bar as a child component.
 * @returns The rendered social share bar component.
 */
export default function SocialShareBar({
	currentSiteLink,
	title = 'Share',
	direction = 'horizontal',
	size = 'sm',
	className,
	asButton = true,
	asChild = true,
}: SocialLinksProps) {
	if (asChild) {
		return (
			<>
				{SOCIAL_SHARE_LINKS.map((link) => (
					<TooltipProvider key={link.channelName}>
						<Tooltip>
							<TooltipTrigger asChild>
								<ExternalLink
									href={
										link.channelHref +
										encodeURIComponent(
											`${link.shareTextInFrontOfURL}${currentSiteLink}`
										)
									}
									ariaLabel={`Share on ${link.channelName}`}
									trusted
									className={cn(
										asButton && buttonVariants({ variant: 'outline' }),
										'px-1 py-0.5 mx-1 h-fit',

										className
									)}
								>
									{size === 'sm' ? (
										<>
											<span className="sr-only">{`Share on ${link.channelName}`}</span>
											<link.Icon className="w-5 h-5" />
										</>
									) : (
										<span className="flex items-center">
											Share on <link.Icon className="w-5 h-5" />
										</span>
									)}
								</ExternalLink>
							</TooltipTrigger>
							<TooltipContent>
								<p>{`Share on ${link.channelName}!`}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
			</>
		);
	}

	return (
		<>
			{title && (
				<>
					<hr className="border-accent-2 my-4" />
					<h3 className="text-base font-medium py-2">{title}</h3>
				</>
			)}
			<div
				className={cn(
					'flex gap-4 flex-wrap',
					direction === 'horizontal' ? 'flex-row' : 'flex-col'
				)}
			>
				{SOCIAL_SHARE_LINKS.map((link) => (
					<TooltipProvider key={link.channelName}>
						<Tooltip>
							<TooltipTrigger asChild>
								<ExternalLink
									href={
										link.channelHref +
										encodeURIComponent(
											`${link.shareTextInFrontOfURL}${currentSiteLink}`
										)
									}
									ariaLabel={`Share on ${link.channelName}`}
									trusted
									className={cn(
										className,
										asButton && buttonVariants({ variant: 'outline' })
									)}
								>
									{size === 'sm' ? (
										<>
											<span className="sr-only">{`Share on ${link.channelName}`}</span>
											<link.Icon size="18" className="w-5 h-5" />
										</>
									) : (
										<span className="flex items-center">
											Share on <link.Icon size="18" className="w-5 h-5" />
										</span>
									)}
								</ExternalLink>
							</TooltipTrigger>
							<TooltipContent>
								<p>{`Share on ${link.channelName}!`}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
			</div>
		</>
	);
}
