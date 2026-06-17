'use client';
// Import Types
// Import External Packages
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
// Import Components
import { Input } from '@/ui/Input';
// Import Functions & Actions & Hooks & State
import { cn, removeSpecialCharacters } from '@/utils';
// Import Data
// Import Assets & Icons
import { SearchIcon } from 'lucide-react';

const searchSchema = z.object({
	search: z.string().min(2),
});

/**
 * Searchbar component.
 *
 * @component
 * @param placeholder - The placeholder text for the search input.
 * @param className - The CSS class name for the component.
 * @param id - The HTML id attribute for the component.
 */
export default function Searchbar({
	placeholder,
	className,
	id,
	rootPage = '/explore',
}: {
	placeholder?: string;
	className?: string;
	id: string;
	rootPage?: string;
}) {
	const Router = useRouter();

	const [currentSearchQuery, setCurrentSearchQuery] = useState<string>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof searchSchema>>({
		resolver: zodResolver(searchSchema),
	});

	let tempSearchQuery = '';

	if (typeof window !== 'undefined') {
		const currentUrl = new URL(window.location.href);
		const currentSearchParams = new URLSearchParams(currentUrl.search);
		tempSearchQuery = currentSearchParams.get('search') || '';
	}

	useEffect(() => {
		if (tempSearchQuery && tempSearchQuery !== '') {
			setCurrentSearchQuery(removeSpecialCharacters(tempSearchQuery));
		} else {
			setCurrentSearchQuery(removeSpecialCharacters(tempSearchQuery));
		}
	}, [tempSearchQuery]);

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		const search = removeSpecialCharacters(data['search'] as string);
		if (!search || search === '') return;
		setCurrentSearchQuery(search);
		if (typeof window !== 'undefined') {
			const currentUrl = new URL(window.location.href);
			const currentSearchParams = new URLSearchParams(currentUrl.search);
			currentSearchParams.set('search', search);
			Router.push(`${rootPage}?${currentSearchParams.toString()}`, {
				scroll: false,
			});
		}
	};

	return (
		<div className={className}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex bg-search-background rounded-xl items-center"
			>
				<SearchIcon size={18} className="text-muted-foreground mx-2" />
				<Input
					id={id}
					type="text"
					placeholder={
						placeholder ||
						'Search our collection with AI: I need a tool that...'
					}
					defaultValue={currentSearchQuery}
					{...register('search')}
					className={cn(
						'border-none bg-transparent w-full flex-grow focus-visible:ring-0 shadow-none text-muted-foreground',
						errors.search ? 'border-red-500' : ''
					)}
					autoComplete="off"
				/>
			</form>
		</div>
	);
}
