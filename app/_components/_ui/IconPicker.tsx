'use client';

import * as React from 'react';
import { icons } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';

// A simple ScrollArea substitute if ScrollArea isn't easily importable
function ScrollArea({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`overflow-y-auto ${className || ''}`}>{children}</div>;
}

interface IconPickerProps {
	value: string;
	onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
	const [search, setSearch] = React.useState('');
	const [isOpen, setIsOpen] = React.useState(false);

	const iconList = React.useMemo(() => {
		return Object.keys(icons).filter(
			(key) =>
				key.toLowerCase().includes(search.toLowerCase()) &&
				key !== 'createLucideIcon' &&
				key !== 'default'
		);
	}, [search]);

	const CurrentIcon = (icons as any)[value] || icons.Folder;

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={isOpen}
					className="w-full justify-between"
				>
					<div className="flex items-center gap-2">
						<CurrentIcon className="w-4 h-4" />
						{value || 'Select icon...'}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0" align="start">
				<div className="p-2 border-b">
					<Input
						placeholder="Search icon..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-8"
					/>
				</div>
				<ScrollArea className="h-64 p-2">
					<div className="grid grid-cols-6 gap-2">
						{iconList.slice(0, 100).map((iconName) => {
							const IconComponent = (icons as any)[iconName];
							return (
								<Button
									key={iconName}
									variant="ghost"
									size="icon"
									className="w-8 h-8 rounded-md"
									onClick={() => {
										onChange(iconName);
										setIsOpen(false);
									}}
									title={iconName}
								>
									<IconComponent className="w-4 h-4" />
								</Button>
							);
						})}
					</div>
					{iconList.length === 0 && (
						<p className="text-center text-sm text-muted-foreground pt-4">
							No icon found.
						</p>
					)}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
