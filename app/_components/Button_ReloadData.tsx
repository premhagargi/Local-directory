'use client';

// Import Types
// Import External Packages
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// Import Components
import { Button, buttonVariants } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { toast } from '@/lib/useToaster';
import { cn } from '@/utils';
import { RefreshCcwIcon } from 'lucide-react';
// Import Data
// Import Assets & Icons

/**
 * A button component that reloads data and displays a toast notification.
 */
export default function ReloadDataButton() {
	const [reloaded, setReloaded] = useState(false);
	const Router = useRouter();

	return (
		<Button
			type="button"
			variant="outline"
			className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
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
			<RefreshCcwIcon className="h-4 w-4 mr-1" />
			Reload Data
		</Button>
	);
}
