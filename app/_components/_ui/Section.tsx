// Import Types
// Import External Packages
import * as React from 'react';
// Import Components
// Import Functions & Actions & Hooks & State
import { cn } from '@/lib/utils';
// Import Data
// Import Assets & Icons

const SectionOuterContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('max-w-screen stretch mx-auto flex flex-col', className)}
		{...props}
	/>
));
SectionOuterContainer.displayName = 'SectionOuterContainer';

const SectionTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<h1
		ref={ref}
		className={cn(
			'font-semibold tracking-tight text-4xl text-foreground dark:text-white',
			className
		)}
		{...props}
	/>
));
SectionTitle.displayName = 'SectionTitle';

const SectionDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('mt-2 text-muted-foreground dark:text-white', className)}
		{...props}
	/>
));
SectionDescription.displayName = 'SectionDescription';

const SectionHeaderContainer = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('pt-10 text-center max-w-2xl mx-auto', className)}
		{...props}
	/>
));
SectionHeaderContainer.displayName = 'SectionHeaderContainer';

const SubSectionOuterContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('mx-auto w-full py-10 md:py-20 px-4 xl:px-0', className)}
		{...props}
	/>
));
SubSectionOuterContainer.displayName = 'SubSectionOuterContainer';

const SubSectionInnerContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'flex flex-col w-full max-w-5xl xl:max-w-7xl mx-auto',
			className
		)}
		{...props}
	/>
));
SubSectionInnerContainer.displayName = 'SubSectionInnerContainer';

const SubSectionContentContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('w-full mt-12', className)} {...props} />
));
SubSectionContentContainer.displayName = 'SubSectionContentContainer';

const SubSectionTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<h2
		ref={ref}
		className={cn(
			'mb-2 text-2xl md:text-4xl font-bold leading-tight text-foreground dark:text-white uppercase',
			className
		)}
		{...props}
	/>
));
SubSectionTitle.displayName = 'SubSectionTitle';

const SubSectionDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('text-sm text-muted-foreground', className)}
		{...props}
	/>
));
SubSectionDescription.displayName = 'SubSectionDescription';

export {
	SectionOuterContainer,
	SectionTitle,
	SectionDescription,
	SubSectionOuterContainer,
	SubSectionInnerContainer,
	SubSectionContentContainer,
	SubSectionTitle,
	SubSectionDescription,
	SectionHeaderContainer,
};
