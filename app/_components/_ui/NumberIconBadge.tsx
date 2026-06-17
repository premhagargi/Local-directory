// Import Types
import { LucideIcon } from 'lucide-react';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export default function NumberIconBadge({
	value,
	Icon,
	color = 'blue',
	className,
}: {
	value: number;
	Icon: LucideIcon;
	color?: 'blue' | 'red' | 'green' | 'yellow' | 'slate';
	className?: string;
}) {
	return (
		<div
			className={cn(
				'relative flex flex-1 flex-row items-center justify-center rounded-2xl',
				className
			)}
		>
			<div className={`w-fit items-center inline-flex flex-row`}>
				<div
					className={`w-8 h-8 absolute bottom-0 z-10 rounded-full opacity-40`}
					style={{ marginLeft: '-5px' }}
				/>
				<Icon className="w-5 h-5" />
				<span className="p-1">
					{value > 0 && formatter.format(value).toLocaleString()}
				</span>
			</div>
		</div>
	);
}
