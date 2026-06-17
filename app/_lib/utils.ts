// Purpose: This file contains all 'general' helper functions.

// Import Types
// Import External Packages
import { type ClassValue, clsx } from 'clsx';
import { format, toZonedTime } from 'date-fns-tz';
import { twMerge } from 'tailwind-merge';
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

/**
 * The e=mc^2 of Tailwind. Combines multiple class names into a single string.
 *
 * @param inputs - The class names to be combined.
 * @returns The combined class names as a string.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Copies the given string to the clipboard.
 *
 * @param str - The string to be copied.
 */
export function CopyToClipboard(str: string | undefined, message?: string) {
	if (!str) return;
	navigator.clipboard.writeText(str);
}

/**
 * Provides a background image URL based on a predefined pattern.
 * @param pattern - The name of the pattern ['blueprint', 'boxes-sm', 'boxes-md', 'boxes-lg', 'dotted', 'hearts'] chosen to convert.
 * @returns The background image URL for the given pattern.
 */
export const backgroundPattern = (pattern: string): string => {
	let svg: string;

	switch (pattern) {
		case 'blueprint':
			svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="#3399cc" stroke="#fff"><path d="M0 0H32V32H0V0Z"/></svg>';
			break;
		case 'boxes-sm':
			svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="#808080"><path d="M0 0H32V32"/></svg>';
			break;
		case 'boxes-md':
			svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="#808080"><path d="M0 0H32V32"/></svg>';
			break;
		case 'boxes-lg':
			svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#808080"><path d="M0 0H32V32"/></svg>';
			break;

		case 'dotted':
			svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="#808080"><circle cx="16" cy="16" r="2" /></svg>';
			break;
		case 'hearts':
			svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="32" height="32" fill="red" stroke="#808080"><path d="M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z"/></svg>';
			break;
		default:
			svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="#3399cc" stroke="#fff"><path d="M0 0H32V32H0V0Z"/></svg>';
	}

	return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

/**
 * Parses headers from an MDX string, e.g. for a Table Of Contents component.
 * Goes 6 levels deep, e.g. 1.1.1.1.1.1.
 * If you need more ... consider changing your formatting style - nobody should go deeper than 6 levels of headers!!! :)
 * Alternatively, change the below 6 to some higher number! ;)
 * @param mdxContent The MDX content to parse headers from.
 * @returns An array of header objects containing the level, title, and slug.
 */
export function parseHeadersFromMDXString(mdxContent: string) {
	const headerRegex = /(?:\n|^) *(#{1,6}) +([^\n]+?)(?:\n|$)/g;
	const headers: {
		level: number;
		title: string;
		slug: string;
	}[] = [];

	let match;
	while ((match = headerRegex.exec(mdxContent)) !== null) {
		const level = match[1].length;
		const title = match[2].trim();
		const slug = stringToSlug(title);

		headers.push({ level, title, slug });
	}
	return headers;
}

/**
 * Converts a string to a slug.
 * Replaces non-word characters and underscores with spaces,
 * splits the string into an array of words, and joins them with hyphens.
 * Finally, converts the resulting string to lowercase.
 *
 * @param string - The string to convert to a slug, such as 'This is a Header!'.
 * @returns The slugified string, such as this-is-a-header.
 */
export function stringToSlug(string: string) {
	return noWhiteSpaceString(string.toString())
		.replace(/[\W_]+/g, ' ')
		.split(' ')
		.join('-')
		.toLowerCase();
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(str: string) {
	if (!str || typeof str !== 'string') return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns the value of a metadata entry from a given Clerk user.
 * @param user - The user to get the metadata entry from.
 * @param key - The key of the metadata entry to get.
 * @returns The value of the metadata entry or undefined.
 */
export function getMetaDataEntryFromClerkUser(user: any): any {
	return user?.publicMetadata['productsOwned'];
}

/**
 * Formats a date string into a localized date string.
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
export function formatDate(dateString: Date) {
	return new Date(dateString).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	});
}

/**
 * Formats a date string into a localized date string.
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
export function formatDateToTimezone(date: Date, timeZone: string) {
	const zonedDate = toZonedTime(date, timeZone);
	return format(zonedDate, 'MMMM d, yyyy', { timeZone });
}

/**
 * Formats the passed time since a given date into a human-readable string.
 * @param created_at - The date in string format to calculate the passed time from.
 * @returns A string representing the passed time in a human-readable format.
 */
export function formatPassedTime(created_at: string | null): string {
	if (!created_at) return '';
	const now = new Date();
	const createdAt = new Date(created_at);
	const diff = Math.abs(now.getTime() - createdAt.getTime());
	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);

	if (years > 365) {
		return `${years} year${years > 1 ? 's' : ''} ago`;
	} else if (months > 0) {
		return `${months} month${months > 1 ? 's' : ''} ago`;
	} else if (days > 0) {
		return `${days} day${days > 1 ? 's' : ''} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else {
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	}
}

/**
 * Removes all whitespace characters from a given string.
 * @param str - The input string.
 * @returns The input string with all whitespace characters removed.
 */
export function noWhiteSpaceString(str: string | undefined) {
	if (!str) return '';
	return str.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
}

/**
 * Checks if a given string is a valid URL.
 *
 * @param url - The string to be validated as a URL.
 * @returns A boolean indicating whether the given string is a valid URL.
 */
export function isValidUrl(url: string) {
	// Regular expression for URL validation
	const urlRegex =
		/^(?:(?:https?):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;

	// Test the given URL against the regex
	return urlRegex.test(url);
}

/**
 * Removes special characters and leading or trailing spaces from a string.
 * @param str - The input string.
 * @returns The input string with special characters removed.
 */
export function removeSpecialCharacters(str: string) {
	return str.replace(/[^\w\s]/gi, '').trim();
}

// Remove JSX syntax from a string
function removeJSX(str: string): string {
	const regex = /<[^>]+>/g;
	return str.replace(regex, '');
}

// Extract the link text from a markdown link
function extractLink(text: string): string {
	const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
	return text.replace(regex, (match, p1) => p1);
}

// Replace newline characters with spaces within a string
function replaceNewlineWithSpace(str: string): string {
	return str.replace(/\n/g, ' ');
}

// Clean MDX content by removing JSX, extracting link text, and replacing newlines
export function cleanMDXContent(mdxContent: string): string {
	const lines = mdxContent.split('\n');
	let inCodeBlock = false;

	const processedLines = lines.map((line) => {
		if (line.startsWith('```')) {
			inCodeBlock = !inCodeBlock;
		}

		if (!inCodeBlock) {
			// Extract the link text from the line and remove any JSX syntax
			return extractLink(removeJSX(line));
		} else {
			// Keep the line as is within code blocks
			return line;
		}
	});

	// Replace newline characters with spaces in the entire content
	return replaceNewlineWithSpace(processedLines.join('\n'));
}

/**
 * Checks if two arrays are equal.
 *
 * @param a - The first array.
 * @param b - The second array.
 * @returns `true` if the arrays are equal, `false` otherwise.
 */
export function arraysEqual(a: any[], b: any[]): boolean {
	if (a.length !== b.length) return false;

	for (let i = 0; i < a.length; i++) {
		if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
	}

	return true;
}

/**
 * Checks if a string is a valid UUID.
 * @param uuid - The string to be checked.
 * @returns A boolean indicating whether the string is a valid UUID.
 */
export function isValidUUID(uuid: string): boolean {
	const regex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return regex.test(uuid);
}

/**
 * Converts a FormData object to a plain JavaScript object.
 * @param formData - The FormData object to convert.
 * @returns An object representing the key-value pairs of the FormData.
 */
export function formDataToObject(formData: FormData): {
	[key: string]: string;
} {
	const obj: { [key: string]: string } = {};
	formData.forEach((value, key) => {
		obj[key] = value as string;
	});
	return obj;
}
