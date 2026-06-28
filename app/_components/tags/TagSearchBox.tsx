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
import { Combobox } from '@/ui/Combobox';
import Searchbar from '@/components/Searchbar';
import { Checkbox } from '@/ui/Checkbox';
import { Label } from '@/ui/Label';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
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
 * Renders a tag search box component.
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

	const valueLabelPairCategories = categories
		.map((category) => {
			return {
				value: category.slug,
				label: category.name,
			};
		})
		.sort((a, b) => {
			const nameA = a.label.toUpperCase();
			const nameB = b.label.toUpperCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});

	const handleCategorySelect = (value: string) => {
		const currentUrl = new URL(window.location.href);
		const currentSearchParams = new URLSearchParams(currentUrl.search);

		currentSearchParams.set('category', value);
		const finalUrl = pathname + '?' + currentSearchParams.toString();
		Router.push(finalUrl, { scroll: false });
	};

	return (
		<div
			className={cn(
				'w-full max-w-[260px] h-fit bg-transparent text-foreground',
				className
			)}
		>
			<div className="flex flex-col gap-y-6">
				{/* Categories */}
				<div className="flex flex-col gap-y-1">
					<button
						onClick={() => handleCategorySelect('')}
						className={cn(
							"flex items-center w-full px-4 py-2.5 rounded-full transition-all duration-200 group text-sm font-semibold",
							!searchParams.get('category')
								? "bg-white text-foreground shadow-sm" 
								: "text-text-secondary hover:bg-black/5 hover:text-foreground"
						)}
					>
						<Folder className={cn("w-4 h-4 mr-3 transition-opacity", !searchParams.get('category') ? "opacity-100 text-foreground" : "opacity-70 group-hover:opacity-100")} />
						All Products
					</button>
					
					{categories.map((category) => {
						const isSelected = searchParams.get('category') === category.slug;
						const IconComponent = category.icon ? (icons as any)[category.icon] || Folder : Folder;
						
						return (
							<button
								key={category.slug}
								onClick={() => handleCategorySelect(category.slug)}
								className={cn(
									"flex items-center w-full px-4 py-2.5 rounded-full transition-all duration-200 group text-sm font-semibold",
									isSelected 
										? "bg-white text-foreground shadow-sm" 
										: "text-text-secondary hover:bg-black/5 hover:text-foreground"
								)}
							>
								<IconComponent className={cn("w-4 h-4 mr-3 transition-opacity", isSelected ? "opacity-100 text-foreground" : "opacity-70 group-hover:opacity-100")} />
								{category.name}
							</button>
						);
					})}
				</div>

				{/* Search */}
				<div className="flex flex-col gap-y-2 pt-4">
					<Searchbar
						placeholder="Search listing..."
						className="w-full bg-white border-border/50 text-foreground placeholder:text-gray-400 focus:bg-white rounded-full shadow-sm"
						id="filter_search"
					/>
				</div>

				{/* Tags */}
				<div className="flex flex-col gap-y-1 pt-4">
					<p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 px-4">Tags</p>
					{Object.keys(groupedTags).map((tagGroupName) => (
						<Disclosure key={tagGroupName} as="div" className="w-full">
							{({ open }) => (
								<>
									<Disclosure.Button className="flex w-full justify-between items-center rounded-lg px-4 py-2 text-left text-sm font-semibold text-text-secondary hover:text-foreground transition-colors">
										<span>{tagGroupName}</span>
										<ChevronUpIcon
											className={cn(
												open ? 'rotate-180 transform' : '',
												'h-4 w-4 transition-transform'
											)}
										/>
									</Disclosure.Button>
									<Disclosure.Panel className="px-4 pt-2 pb-4 text-sm text-text-secondary flex flex-col gap-y-3">
										{groupedSelected[tagGroupName] &&
											groupedSelected[tagGroupName].map((tag) => (
												<div key={tag.label} className="flex items-center group cursor-pointer" onClick={() => handleSelect(tag.value, 'remove')}>
													<div className="w-4 h-4 rounded-full bg-foreground flex items-center justify-center mr-3 transition-colors">
														<X className="w-3 h-3 text-background" />
													</div>
													<Label className="text-foreground cursor-pointer font-medium">{tag.label}</Label>
												</div>
											))}

										{groupedSelectables[tagGroupName] &&
											groupedSelectables[tagGroupName].map((tag) => (
												<div key={tag.label} className="flex items-center group cursor-pointer" onClick={() => handleSelect(tag.value, 'add')}>
													<div className="w-4 h-4 rounded-full border border-border group-hover:border-foreground flex items-center justify-center mr-3 transition-colors" />
													<Label className="text-text-secondary group-hover:text-foreground cursor-pointer font-medium">{tag.label}</Label>
												</div>
											))}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					))}
				</div>
			</div>
		</div>
	);
}
