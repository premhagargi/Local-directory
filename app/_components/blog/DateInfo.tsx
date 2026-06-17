// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import { formatDate } from '@/lib/utils';
// Import Data
// Import Assets & Icons

/**
 * A component that displays the creation and update dates of a blog post.
 * @param createDate - The date the blog post was created.
 * @param updateDate - The date the blog post was last updated.
 */
export default function DateInfo({
	createDate,
	updateDate,
}: {
	createDate: Date;
	updateDate?: Date | undefined;
}) {
	if (!createDate) return null;
	return (
		<div className="relative mx-auto pb-8">
			<h2 id="creationDate" className="font-semibold text-sm dark:text-white">
				Dates
			</h2>
			<div className="grid grid-cols-2 px-2 text-sm text-muted-foreground dark:text-white">
				<div className="pl-1">
					<p>Published</p>
					<p>Updated</p>
				</div>
				<div className="grid">
					<time dateTime={createDate.toString()}>{formatDate(createDate)}</time>
					<time dateTime={updateDate?.toString()}>
						{updateDate ? formatDate(updateDate) : '-'}
					</time>
				</div>
			</div>
		</div>
	);
}
