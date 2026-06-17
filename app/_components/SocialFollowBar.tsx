// Import Types
// Import External Packages
// Import Components
import ExternalLink from '@/ui/ExternalLink';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
import { COMPANY_MARKETING_INFORMATION } from '@/constants';
// Import Assets & Icons

type SocialLinksProps = {
	direction?: 'horizontal' | 'vertical';
	size?: 'sm' | 'lg';
	className?: string;
};

/**
 * Renders a social follow bar component.
 *
 * @param links - An array of social follow links.
 * @param direction - The direction of the social follow bar (horizontal or vertical).
 * @param size - The size of the social follow icons (small or large).
 * @param className - Additional CSS class names for the component.
 * @returns The rendered social follow bar component.
 */
export default function SocialFollowBar({
	direction = 'horizontal',
	size = 'sm',
	className,
}: SocialLinksProps) {
	return (
		<div
			className={cn(
				'flex gap-4',
				direction === 'horizontal' ? 'flex-row' : 'flex-col'
			)}
		>
			{COMPANY_MARKETING_INFORMATION.SOCIAL_LINKS.map((link) => (
				<ExternalLink
					key={link.CHANNEL_NAME}
					href={link.CHANNEL_HREF}
					ariaLabel={`Follow us on ${link.CHANNEL_NAME}`}
					trusted
					follow
					className={className}
				>
					{size === 'sm' ? (
						<>
							<span className="sr-only">{`Follow us on ${link.CHANNEL_NAME}`}</span>
							<link.Icon />
						</>
					) : (
						`${link.CHANNEL_NAME}: ${link.USERNAME}`
					)}
				</ExternalLink>
			))}
		</div>
	);
}
