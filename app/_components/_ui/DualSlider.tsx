'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const DualSlider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, onValueChange, ...props }, ref) => {
	const [localValues, setLocalValues] = React.useState<number[]>([]);

	React.useEffect(() => {
		const minValue =
			props.value && props.value[0]
				? props.value[0]
				: props.min
				? props.min
				: 0;
		const maxValue =
			props.value && props.value[1]
				? props.value[1]
				: props.max
				? props.max
				: 100000000;

		setLocalValues([minValue, maxValue]);
	}, [props.max, props.min, props.value]);

	const handleValueChange = (newValues: number[]) => {
		setLocalValues(newValues);
		if (onValueChange) {
			onValueChange(newValues);
		}
	};

	return (
		<SliderPrimitive.Root
			ref={ref}
			className={cn(
				'relative flex w-full touch-none select-none items-center',
				className
			)}
			onValueChange={handleValueChange}
			{...props}
		>
			<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
				<SliderPrimitive.Range className="absolute h-full bg-primary" />
			</SliderPrimitive.Track>
			{localValues.map((value, index) => (
				<React.Fragment key={index}>
					<SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
				</React.Fragment>
			))}
		</SliderPrimitive.Root>
	);
});
DualSlider.displayName = SliderPrimitive.Root.displayName;

export { DualSlider };
