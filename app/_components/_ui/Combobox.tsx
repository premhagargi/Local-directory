'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/Button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';

export function Combobox({
	itemName,
	valueLabelPair,
	changeFunction,
	whatShouldBeReturned = 'value',
	whatShouldBeSearchable,
	reset,
}: {
	itemName: string;
	valueLabelPair: { value: string; label: string }[];
	changeFunction: (value: string) => void;
	whatShouldBeReturned: 'value' | 'label';
	whatShouldBeSearchable: 'value' | 'label';
	reset?: string;
}) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState<string | undefined>('');

	React.useEffect(() => {
		if (reset) {
			setValue(undefined);
		}
	}, [reset]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full bg-transparent justify-between"
				>
					{value
						? valueLabelPair.find((pair) => pair.value === value)?.label
						: `Select ${itemName}...`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className=" p-0">
				<Command>
					<CommandInput placeholder={`Search ${itemName}...`} />
					<CommandList>
						<CommandEmpty> {`No ${itemName} found.`} </CommandEmpty>
						<CommandGroup>
							{valueLabelPair.map((pair) => (
								<CommandItem
									key={pair.value}
									keywords={[pair[whatShouldBeSearchable]]}
									value={pair.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue);
										setOpen(false);
										changeFunction(
											whatShouldBeReturned === 'value'
												? currentValue
												: pair.label
										);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === pair.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{pair.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
