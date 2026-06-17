// Purpose: Generates a sitemap for the website

// Import Types
import { MetadataRoute } from 'next';
// Import External Packages
import path from 'path';
import fs from 'fs';
// Import Components
// Import Functions & Actions & Hooks & State
import { getAllSlugsFromPublishedPosts } from '@/actions/blog/getAllSlugsFromPublishedPosts';
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

// THIS PAGE CREATES A SITEMAP FOR THE WEBSITE
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

type URL_Object = {
	url: string;
};

function readFolderStructure(
	dirPath = path.join(process.cwd(), '/app'),
	previousFolder = ''
) {
	const urls: URL_Object[] = [];
	const disabledIncludes = ['(Protected)', 'api', 'thank-you', 'checkout'];
	if (!GENERAL_SETTINGS.USE_SUBLISTINGS) {
		disabledIncludes.push('products', 'subcategory', 'subtag');
	}
	const disabledStartsWith = ['_', '['];
	fs.readdirSync(dirPath, { withFileTypes: true }).forEach((dirent) => {
		if (dirent.isDirectory()) {
			const dirName = dirent.name;

			// Apply filters
			if (
				!disabledIncludes.some((disabled) => dirName.includes(disabled)) &&
				!disabledStartsWith.some((disabled) => dirName.startsWith(disabled))
			) {
				// Check for leaf directories or specific files to construct URLs
				const fullPath = path.join(dirPath, dirName);
				// If directory should be ignored based on its name, skip further processing
				if (!dirName.match(/\(.*\)/)) {
					// Assuming logic here to determine if `dirName` is a leaf directory or of interest
					// This could be as simple as checking for the presence of certain files
					const url =
						previousFolder === ''
							? `${COMPANY_BASIC_INFORMATION.URL}/${dirName}`
							: `${COMPANY_BASIC_INFORMATION.URL}/${previousFolder}/${dirName}`;
					urls.push({ url });

					const childUrls = readFolderStructure(
						fullPath,
						previousFolder + dirName
					);
					urls.push(...childUrls);
				} else {
					// Recursive call if further directory traversal is needed
					const childUrls = readFolderStructure(fullPath);
					urls.push(...childUrls);
				}
			}
		}
	});
	return urls;
}

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const supabase = createSupabaseBrowserClient();

	const BASE_URL: URL_Object[] = [
		{
			url: `${COMPANY_BASIC_INFORMATION.URL}`,
		},
	];

	// Level 1: Base Pages => website.com/{LEVEL_1}
	// If you have a lot of base level pages, write a script to read all folders in the /app directory and create a URL for each folder, ignore /(Protected) and /api. For the folder (Public), create a URL for each file in the folder.

	const LEVEL1_PAGES: URL_Object[] = readFolderStructure();

	// Level 2: /explore/[slug] => website.com/explore/[slug]

	const listingSlugs = await supabase
		.from('listings')
		.select('slug')
		.match({ is_user_published: true, is_admin_published: true });
	const slugs = listingSlugs?.data?.map(({ slug }) => ({ slug: slug }));

	const LEVEL2_LISTING_SLUGS: URL_Object[] = slugs
		? slugs.flatMap((listing) => ({
				url: `${COMPANY_BASIC_INFORMATION.URL}/explore/${listing.slug}`,
		  }))
		: [];

	// Level 2: /blog => website.com/blog/{slug}

	const { data: blogSlugs } = await getAllSlugsFromPublishedPosts();

	const LEVEL2_BLOG_SLUGS: URL_Object[] = blogSlugs.map((postSlug) => {
		return {
			url: `${COMPANY_BASIC_INFORMATION.URL}/blog/${postSlug.slug}`,
		};
	});

	// Tag level 2: /tag => website.com/tag/{slug}

	const { data: tagData } = await supabase.rpc('get_active_tags');

	const LEVEL2_TAG_SLUGS = tagData
		? tagData.flatMap((tag) => ({
				url: `${COMPANY_BASIC_INFORMATION.URL}/tag/${tag.slug}`,
		  }))
		: [];

	// Category Level 2: /category => website.com/category/{slug}

	const { data: categoryData } = await supabase.rpc('get_active_categories');

	const LEVEL2_CATEGORY_SLUGS = categoryData
		? categoryData.flatMap((tag) => ({
				url: `${COMPANY_BASIC_INFORMATION.URL}/category/${tag.slug}`,
		  }))
		: [];

	// Owners Level 2: /user => website.com/user/{slug}
	const { data: userData } = await supabase.rpc('get_user_usernames');

	const LEVEL2_OWNER_SLUGS = userData
		? userData.flatMap((userProfile) => ({
				url: `${COMPANY_BASIC_INFORMATION.URL}/user/${userProfile.username}`,
		  }))
		: [];

	// Level 2: /products/[slug] => website.com/products/[slug]

	const sublistingsArray = await supabase
		.from('sublistings')
		.select('slug')
		.match({ is_user_published: true, is_admin_published: true });
	const sublistingSlugs = sublistingsArray?.data?.map(({ slug }) => ({
		slug: slug,
	}));

	const LEVEL2_SUBLISTING_SLUGS: URL_Object[] = sublistingSlugs
		? sublistingSlugs.flatMap((listing) => ({
				url: `${COMPANY_BASIC_INFORMATION.URL}/products/${listing.slug}`,
		  }))
		: [];

	// Tag level 2: /subtag => website.com/subtag/{slug}

	const { data: subtagData } = await supabase.rpc('get_active_subtags');

	const LEVEL2_SUBTAG_SLUGS = subtagData
		? subtagData.flatMap((tag) => ({
				url: `${COMPANY_BASIC_INFORMATION.URL}/subtag/${tag.slug}`,
		  }))
		: [];

	// Category Level 2: /subcategory => website.com/subcategory/{slug}

	const { data: subcategoryData } = await supabase.rpc(
		'get_active_subcategories'
	);

	const LEVEL2_SUBCATEGORY_SLUGS = subcategoryData
		? subcategoryData.flatMap((tag) => ({
				url: `${COMPANY_BASIC_INFORMATION.URL}/subcategory/${tag.slug}`,
		  }))
		: [];

	return [
		...BASE_URL,
		...LEVEL1_PAGES,
		...LEVEL2_BLOG_SLUGS,
		...LEVEL2_LISTING_SLUGS,
		...LEVEL2_TAG_SLUGS,
		...LEVEL2_CATEGORY_SLUGS,
		...LEVEL2_OWNER_SLUGS,
		...(GENERAL_SETTINGS.USE_SUBLISTINGS ? LEVEL2_SUBLISTING_SLUGS : []),
		...(GENERAL_SETTINGS.USE_SUBLISTINGS ? LEVEL2_SUBTAG_SLUGS : []),
		...(GENERAL_SETTINGS.USE_SUBLISTINGS ? LEVEL2_SUBCATEGORY_SLUGS : []),
	];
}
