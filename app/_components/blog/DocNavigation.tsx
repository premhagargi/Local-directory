// Import Types
// Import External Packages
import Link from 'next/link';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * A component that displays navigation links to the previous and next documents.
 * @param previousTitle - The title of the previous document.
 * @param nextTitle - The title of the next document.
 * @param previousLink - The link to the previous document.
 * @param nextLink - The link to the next document.
 */
export default function DocNavigation({
	previousTitle = 'Previous',
	nextTitle = 'Next',
	previousLink,
	nextLink,
}: {
	previousTitle?: string;
	nextTitle?: string;
	previousLink?: { name: string; href: string };
	nextLink?: { name: string; href: string };
}) {
	return (
		<div
			id="doc-navigation"
			className="grid grid-cols-2 mt-4 gap-2 align-top w-full"
		>
			{previousLink ? (
				<Link href={previousLink.href} className="col-span-2 md:col-span-1">
					<div className=" bg-white dark:bg-black border border-transparent dark:border-white dark:hover:bg-white/10 rounded-md drop-shadow-xl p-4 flex items-start justify-between text-right hover:drop-shadow-md hover:cursor-pointer dark:text-white h-full">
						<ArrowLeft className="w-6 h-6 mr-2 self-center" />
						<div className="grid">
							<p className="italic text-sm">{previousTitle}</p>
							<p className="font-medium">{previousLink.name}</p>
						</div>
					</div>
				</Link>
			) : (
				<div className="md:col-span-1" />
			)}
			{nextLink ? (
				<Link href={nextLink.href} className="col-span-2 md:col-span-1">
					<div className=" bg-white dark:bg-black border border-transparent dark:border-white dark:hover:bg-white/10 rounded-md drop-shadow-xl p-4 flex justify-between text-left hover:drop-shadow-md hover:cursor-pointer dark:text-white h-full items-start">
						<div className="grid">
							<p className="italic text-sm">{nextTitle}</p>
							<p className="font-medium">{nextLink.name}</p>
						</div>
						<ArrowRight className="w-6 h-6 ml-2 self-center" />
					</div>
				</Link>
			) : (
				<div className="md:col-span-1" />
			)}
		</div>
	);
}
