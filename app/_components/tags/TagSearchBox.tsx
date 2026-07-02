'use client';

// Import Types
import { CategoryType, TagType } from '@/supabase-special-types';
import { ValueLabelPair } from '@/types';
// Import External Packages
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// Import Components
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '@/ui/Sheet';
import Searchbar from '@/components/Searchbar';
import { Label } from '@/ui/Label';
import { Button } from '@/ui/Button';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Assets & Icons
import { MenuIcon, X, ChevronUpIcon, Folder, icons } from 'lucide-react';
import { Disclosure } from '@headlessui/react';

export function TagSearchBoxMobile({
	tags,
	categories,
	className,
}: {
	tags: TagType[];
	categories: CategoryType[];
	className?: string;
}) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className={cn(
						'rounded-full text-muted-foreground bg-transparent w-24 px-2',
						className
					)}
				>
					<MenuIcon className="h-5 w-5" />
					<span className="px-2">Filter</span>
					<span className="sr-only">Toggle filter menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				className="w-80 pt-10 max-h-screen overflow-y-auto"
				side="right"
			>
				<SheetTitle>
					<span className="sr-only">Filter menu</span>
				</SheetTitle>
				<SheetDescription>
					<span className="sr-only">Filter through all listings</span>
				</SheetDescription>

				<TagSearchBox tags={tags} categories={categories} className="w-full" />
			</SheetContent>
		</Sheet>
	);
}

/**
 * Renders a tag search box component — AppStacks sidebar style.
 * @param tags - An array of tags.
 */
export function TagSearchBox({
	tags,
	categories,
	className,
}: {
	tags: TagType[];
	categories: CategoryType[];
	className?: string;
}) {
	const [allTags, setAllTags] = useState<ValueLabelPair[]>([]);
	const [selected, setSelected] = useState<ValueLabelPair[]>([]);
	const [resetCategorySelector, setResetCategorySelector] = useState('');

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const Router = useRouter();

	function clusterTagsByGroups(selectables: ValueLabelPair[]) {
		const tagChoiceGroups: {
			[groupName: string]: ValueLabelPair[];
		} = { Other: [] };

		selectables.forEach((selectableTag) => {
			const correspondingTag = tags.find(
				(tag) => tag.slug === selectableTag.value
			);

			if (!correspondingTag || !correspondingTag.tag_groups) return;

			if (correspondingTag.tag_groups.length === 0) {
				tagChoiceGroups['Other'].push({
					value: correspondingTag.slug,
					label: correspondingTag.name,
				});
			} else {
				correspondingTag.tag_groups.forEach((group) => {
					if (!tagChoiceGroups[group.name]) {
						tagChoiceGroups[group.name] = [];
					}
					tagChoiceGroups[group.name].push({
						value: correspondingTag.slug,
						label: correspondingTag.name,
					});
				});
			}
		});

		if (tagChoiceGroups['Other'].length === 0) {
			delete tagChoiceGroups['Other'];
		}

		return tagChoiceGroups;
	}

	useEffect(() => {
		if (tags.length === 0) return;
		const formattedTags: ValueLabelPair[] = tags.map((tag) => {
			return {
				value: tag.slug,
				label: tag.name,
			};
		});
		setAllTags(formattedTags);

		const searchTags = searchParams.get('tags');

		if (!searchTags) return;

		const preSelected = searchTags
			.split(',')
			.map((searchTag) => formattedTags.find((tag) => tag.value === searchTag))
			.filter(Boolean) as ValueLabelPair[];

		setSelected(preSelected);
	}, [tags, searchParams]);

	const handleRemoveAllParams = () => {
		setSelected([]);
		setResetCategorySelector(Math.random().toString());
		const currentUrl = new URL(window.location.href);
		const currentSearchParams = new URLSearchParams(currentUrl.search);
		currentSearchParams.delete('tags');
		currentSearchParams.delete('subcategory');
		currentSearchParams.delete('availability');
		currentSearchParams.delete('minPrice');
		currentSearchParams.delete('maxPrice');
		currentSearchParams.delete('search');
		currentSearchParams.delete('category');
		currentSearchParams.delete('listing');
		Router.push(pathname + '?' + currentSearchParams.toString(), {
			scroll: false,
		});
	};

	const handleSelect = (value: string, type: 'add' | 'remove') => {
		const currentUrl = new URL(window.location.href);
		const currentSearchParams = new URLSearchParams(currentUrl.search);

		if (value === '' && type === 'remove') {
			currentSearchParams.delete('tags');
			setSelected([]);
			Router.push(pathname + '?' + currentSearchParams.toString(), {
				scroll: false,
			});
			return;
		}
		const newTag = allTags.find((tag) => tag.value === value);
		let newTagArray = [];
		if (!newTag) return;
		if (type === 'remove') {
			newTagArray = selected.filter((tag) => tag.value !== value);
			setSelected((prev) => prev.filter((s) => s.value !== value));
		} else {
			newTagArray = selected.concat(newTag);
		}

		if (newTagArray.length === 0) {
			currentSearchParams.delete('tags');
			Router.push(pathname + '?' + currentSearchParams.toString(), {
				scroll: false,
			});
			return;
		}
		const newTagString = newTagArray.map((tag) => tag.value).join(',');
		currentSearchParams.set('tags', newTagString);
		const finalUrl = pathname + '?' + currentSearchParams.toString();
		Router.push(finalUrl, { scroll: false });
	};

	const selectables = allTags.filter(
		(tag) => !selected.some((selectedTag) => selectedTag.value === tag.value)
	);

	const groupedSelectables = clusterTagsByGroups(selectables);
	const groupedSelected = clusterTagsByGroups(selected);
	const groupedTags = clusterTagsByGroups(
		tags.map((tag) => {
			return {
				value: tag.slug,
				label: tag.name,
			};
		})
	);

	// Color palette for category dot icons — matches AppStacks vibe
	const colorPalette = [
		'bg-blue-500',
		'bg-purple-500',
		'bg-rose-500',
		'bg-amber-500',
		'bg-emerald-500',
		'bg-cyan-500',
		'bg-orange-500',
		'bg-pink-500',
		'bg-violet-500',
		'bg-teal-500',
		'bg-red-500',
		'bg-indigo-500',
	];

	return (
		<div
			className={cn(
				'w-full text-foreground',
				className
			)}
		>
			<div className="flex flex-col gap-y-1">
				{/* All Products — AppStacks: pill selected state */}
				<button
					onClick={handleRemoveAllParams}
					className={cn(
						'flex items-center w-full px-3 py-2.5 rounded-[9px] transition-all duration-150 text-[14px] font-semibold text-left',
						!searchParams.get('category')
							? 'bg-black/[0.07] text-foreground'
							: 'text-foreground/70 hover:bg-black/[0.04] hover:text-foreground'
					)}
				>
					{/* Dot icon */}
					<span className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center mr-3 flex-shrink-0">
						<span className="w-2.5 h-2.5 rounded-full bg-white dark:bg-black" />
					</span>
					All Products
				</button>

				{/* Category list */}
				{categories.map((category) => {
					const isSelected = searchParams.get('category') === category.slug;
					const IconComponent = category.icon
						? (icons as any)[category.icon] || Folder
						: Folder;
					const colorIdx = category.name.charCodeAt(0) % colorPalette.length;
					const iconBg = colorPalette[colorIdx];

					return (
						<button
							key={category.slug}
							onClick={() => {
								const currentUrl = new URL(window.location.href);
								const currentSearchParams = new URLSearchParams(currentUrl.search);
								currentSearchParams.set('category', category.slug);
								Router.push(pathname + '?' + currentSearchParams.toString(), {
									scroll: false,
								});
							}}
							className={cn(
								'flex items-center w-full px-3 py-2.5 rounded-[9px] transition-all duration-150 text-[14px] font-semibold text-left',
								isSelected
									? 'bg-black/[0.07] text-foreground'
									: 'text-foreground/70 hover:bg-black/[0.04] hover:text-foreground'
							)}
						>
							<span
								className={cn(
									'w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0',
									iconBg
								)}
							>
								<IconComponent className="w-3.5 h-3.5 text-white" />
							</span>
							{category.name}
						</button>
					);
				})}

				{/* Divider */}
				<div className="my-3 border-t border-border/40" />

				{/* Tags — collapsible groups */}
				{Object.keys(groupedTags).length > 0 && (
					<>
						<p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary mb-1 px-3 pt-1">
							Tags
						</p>
						{Object.keys(groupedTags).map((tagGroupName) => (
							<Disclosure key={tagGroupName} as="div" className="w-full">
								{({ open }) => (
									<>
										<Disclosure.Button className="flex w-full justify-between items-center rounded-[9px] px-3 py-2 text-left text-[13px] font-semibold text-text-secondary hover:bg-black/[0.04] hover:text-foreground transition-colors">
											<span>{tagGroupName}</span>
											<ChevronUpIcon
												className={cn(
													open ? 'rotate-180 transform' : '',
													'h-3.5 w-3.5 transition-transform'
												)}
											/>
										</Disclosure.Button>
										<Disclosure.Panel className="px-3 pt-1 pb-3 text-[13px] text-text-secondary flex flex-col gap-y-2.5">
											{groupedSelected[tagGroupName] &&
												groupedSelected[tagGroupName].map((tag) => (
													<div
														key={tag.label}
														className="flex items-center group cursor-pointer"
														onClick={() => handleSelect(tag.value, 'remove')}
													>
														<div className="w-3.5 h-3.5 rounded-full bg-foreground flex items-center justify-center mr-2.5 flex-shrink-0">
															<X className="w-2.5 h-2.5 text-background" />
														</div>
														<Label className="text-foreground cursor-pointer font-medium text-[13px]">
															{tag.label}
														</Label>
													</div>
												))}
											{groupedSelectables[tagGroupName] &&
												groupedSelectables[tagGroupName].map((tag) => (
													<div
														key={tag.label}
														className="flex items-center group cursor-pointer"
														onClick={() => handleSelect(tag.value, 'add')}
													>
														<div className="w-3.5 h-3.5 rounded-full border border-border group-hover:border-foreground flex items-center justify-center mr-2.5 flex-shrink-0 transition-colors" />
														<Label className="text-text-secondary group-hover:text-foreground cursor-pointer font-medium text-[13px]">
															{tag.label}
														</Label>
													</div>
												))}
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
						))}
					</>
				)}
			</div>
		</div>
	);
}
