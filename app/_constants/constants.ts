// Import Types
import { SortDirectionObject, SublistingSortDirectionObject } from '@/types';
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons
import { Icons } from '@/ui/Icons';

/**
 * START HERE - This is the place where you can make this template your own.
 */

/**
 * Contains the basic information about the company.
 */
export const COMPANY_BASIC_INFORMATION = {
	/**
	 * The name of the company.
	 */
	NAME: 'CompanyName',

	/**
	 * The legal name of the company. If no legal name is available, use the name of the company.
	 */
	LEGAL_NAME: 'Company Name LLC',

	/**
	 * The OTHER_INFO_TEXT will only be shown in the imprint. It can be used to show additional information, e.g. the VAT-ID of your business. It is an array of strings, where each string will be shown as a separate line.
	 */
	OTHER_INFO_LINES: ['EU-Vat-ID: 1234'],

	/**
	 * The address of the company. Leave as '' if you do not want to display an address.
	 */
	ADDRESS: 'Example Street 123, 12345 Example City, Example Country',

	/**
	 * The URL of the company's website.
	 */
	URL: 'https://SOME_URL.com',

	/**
	 * The support email of the company.
	 */
	SUPPORT_EMAIL: 'support@SOME_URL.com',

	/**
	 * The support phone number of the company. (This is needed in certain countries for the imprint.)
	 */
	SUPPORT_PHONE: '+1 234 567 890',

	/**
	 * The founding year of the company. For auto-updating the age of the company in the footer.
	 */
	FOUNDING_YEAR: '2024',

	/**
	 * The URL of the parent company's website. If you have a holding or a personal portfolio website, you can link it here.
	 */
	PARENT_COMPANY_URL: 'https://SOME_ORTHER_URL.com',

	/**
	 * The name of the responsible person for the website. This is the person who is responsible for the content of the website, e.g. for the Cookie Policy.
	 */
	RESPONSIBLE_PERSON: 'YOUR NAME',
};

/**
 * Constants for company marketing information.
 */
export const COMPANY_MARKETING_INFORMATION = {
	/**
	 * The meta title for the resource directory. Maximum 60-70 characters.
	 */
	META_TITLE: 'A resource directory for ABCs and XYZs',

	/**
	 * The meta description for the resource directory. Maximum 160 characters.
	 */
	META_DESCRIPTION: 'Find the best tools and resources for your ABC journey.',

	/**
	 * The meta keywords for the resource directory. Max 10 keywords.
	 */
	META_KEYWORDS: ['some', 'keywords', 'your', 'target audience', 'googles'],

	/**
	 * The social links for the resource directory.
	 * You'll need at least a Twitter / X Account because of meta data sharing.
	 * The Twitter / X account needs to be the first in the array.
	 * If you need more ICONS add to /app/_compontents/ui/Icons.ts. * Alternatively, you can use Lucide Icons.
	 */
	SOCIAL_LINKS: [
		{
			/**
			 * The name of the social channel.
			 */
			CHANNEL_NAME: 'X',

			/**
			 * The URL of the social channel.
			 */
			CHANNEL_HREF: 'https://x.com/domainerskit',

			/**
			 * The username for the social channel.
			 */
			USERNAME: '@domainerskit',

			/**
			 * The icon for the social channel.
			 */
			Icon: Icons.X,
		},
	],
};

/**
 * Bot User Id
 * Create a new user in the database without login and add the UUID here. All automated activity will be assigned to this user.
 */

export const BOT_USER_ID = '11111111-1111-4111-1111-111111111111';

/**
 * The data for the promotions.
 */

export const PROMOTIONS_DATA = {
	// The price of the promotion in USD per DAY. 1 = 1 USD.
	FIXED_FEE_PER_DAY: 1,
	// The PRICE_ID for the promotion product in Stripe.
	STRIPE_PRICE_ID: 'price_...',
	// The discount for the 30 day promotion. 0.1 = 10% discount.
	THIRTY_DAY_DISCOUNT: 0.1,
	// The COUPON_ID for the promotion product in Stripe. This coupong should give the same discount as the THIRTY_DAY_DISCOUNT.
	STRIPE_COUPON_ID: '......',
};

/**
 * The general settings for the resource directory.
 */

export const GENERAL_SETTINGS = {
	// Do you want to use sublistings? If you set this to false, the system will not show anything related to 'Products' (including sublistings, subcategories, etc.) to your users. There might be some references throughout the admin area. If you want to get rid of them: search for "products" or "sublisting" and delete all references. You can still use the system as a directory for listings only.
	USE_SUBLISTINGS: false,

	// Shall the system count clicks on the Visit Website buttons on a listings page?
	USE_CLICK: true,

	// Shall users be allowed to publish listings?
	// Setting this to false will disable SIGN-UPs and the ACCOUNT button in the Navbar. You will have to register first and then head to /sign-in manually.
	USE_PUBLISH: true,

	// Shall users be allowed to like listings?
	USE_LIKE: true,

	// Shall the system count listings views (very very basic)?
	USE_VIEW: true,

	// Shall users be allowed to rate a listings?
	USE_RATE: true,

	// The maximum number of stars to show in the star rating.
	MAX_NUM_STARS: 5,

	// Display the rating (when more than 0) in the listing card?
	USE_RATING_ON_CARD: true,

	// Shall users be allowed to promote their listings?
	// (Displays the 'Promote it!' button -> which will lead to a pop up telling the user to write an email as this boilerplate does not include payment processing.)
	USE_PROMOTE: true,

	// Shall users be allowed to report listings?
	// (Displays the 'Report' button -> will land in Feedback DB
	USE_REPORT: true,

	// Shall users be allowed to claim a listing?
	// (Displays the 'Claim it' button -> which will lead to a pop up telling the user to write an email as this boilerplate does not include automatic claiming. You can then manually check the claim and approve it by adding them as the owner to a listing. This is a manual process.)
	USE_CLAIM: true,

	// Shall users be allowed to listings stats through the 'See Stats' Button on the listing page and on the bottom bar on each listing card?
	// The listings stats are Likes, Views and Ratings. If you disable them, you should also disable the Stats Button.
	USE_STATS: false,

	// Shall users be allowed to share listings through social media?
	USE_SOCIAL_SHARE: true,

	// Shall Ads and Ad Slots be shown on the website?
	USE_ADS: false,

	// Do you - as an Admin - want to pre-approve each user-approved listing before it is published?
	// Set 'false' if you want to manually review and approve listings before they are published. This is advisable, if you allow users to publish listings.
	// If you set 'true', all listings will be published immediately after you or the user have published them.
	PRE_ADMIN_APPROVE_LISTINGS: false,

	// Do you - as an Admin - want to pre-approve each user-approved SUBlisting before it is published?
	// Set 'false' if you want to manually review and approve sublistings before they are published. This is advisable, if you allow users to publish sublistings.
	// If you set 'true', all sublistings will be published immediately after you or the user have published them.
	PRE_ADMIN_APPROVE_SUBLISTINGS: true,

	// Do you - as an Admin - want to pre-approve each user-approved blog post before it is published?
	// Set 'false' if you want to manually review and approve blog posts before they are published. This is advisable, if you allow users to publish blog posts.
	// If you set 'true', all blog posts will be published immediately after you or the user have published them.
	PRE_ADMIN_APPROVE_BLOGPOSTS: false,

	// Do you want to use the AI Content Creation Button that fills in the description of a listing with AI generated content? Only shown for Admins. If you want to show this to all users, you have to change the code in the Listing page & the blog post page. (search for USE_AI_CONTENT_CREATION and remove the second check for isSuperAdmin)
	USE_AI_CONTENT_CREATION: true,

	// Do you want to show the 'New' badge on listings that are younger than X DAYS? Enter 0 to disable the 'New' badge.
	MAX_NUM_DAY_AGE_FOR_NEW_BADGE: 7,

	// Do you want to use Role Based Accound Control (RBAC)? If you set this to false, all users will have the same rights. If set to true, you will, per default, have two user roles: Users who can create listings (and everything else) and Users who basically can do nothing but change their account settings and view coupon codes on listings - if listings have a coupon code associated with them. The user roles & permissoins can of course be adapted to your needs. See constants/rbac_config.ts for more information.
	USE_RBAC: false,
};

// Listings & Sublistings

// Let AI know what your listings and sublistings are about. This will help the AI to generate better content for your listings and sublistings.

export const LISTINGS_SETTINGS = {
	singularName: 'Listing',
	pluralName: 'Listings',
	explanationForAiContentCreation:
		'This type of listing provides detailed information about one XYZ.',
};

export const SUBLISTINGS_SETTINGS = {
	singularName: 'Product',
	pluralName: 'Products',
	explanationForAiContentCreation:
		'This type of listing provides detailed information about a product for example: XYZ.',
};

/* *
 * Next, you will find module specific settings. They are used within multiple components and pages. To have a consistent look and feel, they have been moved to this file.
 * You can leave them as is or change them to your liking.
 * ! Do not change the structure of the objects. Only change the values.
 * */

// HERO

export const HERO_TITLE = 'All Things ABC.';
export const HERO_SLOGAN = 'The ultimate resource directory for XYZ.';

// FOOTER

// What is the name of the creator of the website?

export const CREATOR_INFORMATION = {
	/**
	 * The name of the creator.
	 */
	NAME: 'YOUR NAME',

	/**
	 * The URL of the creator's website.
	 */
	HREF: 'https://x.com/@YOUR_HANDLE',
};

// What are disclaimers you want to show in the Footer?

export const FOOTER_DISCLAIMERS = [
	"Disclaimer: All external links are affiliate links and lead to a partner's website.",
];

// What is the slogan you want to show in the Footer?

export const FOOTER_SLOGAN = 'The ultimate resource directory for XYZs';

// What are the external links you want to show in the Footer? (e.g. to your other projects)

export const FOOTER_EXTERNAL_LINK_LIST: { label: string; href: string }[] = [
	{
		label: 'Label 1',
		href: 'Link 1',
	},
	{
		label: 'Directory Boilerplate @ DirectoryStack.com',
		href: 'https://directorystack.com',
	},
	{
		label: 'Label 3',
		href: 'Link 3',
	},
];

// Ad slots are the slots where ads can be displayed. You can add as many as you want. Each slot must have a unique name and must be accompanied by a corresponding AdSlot. Per default, each CATEGORY has two ad slots - top of the page and bottom of the page. You can add more ad slots names here. If you want to add a new ad slot, add it here. Otherwise, do not change this. The default options are: Explore is the main page, Blog is the blog page, and Other is all other pages (e.g. tag pages).

export const ADDITIONAL_AD_SLOTS = [
	'explore-1',
	'explore-2',
	'blog-1',
	'blog-2',
	'blog-3',
	'other-1',
];

// What are the image options you want to show in the Content Editor?

export const DEFAULT_IMAGE_OPTIONS = [
	{
		localHref: '/img/blog/breaking_news.png',
		nameInDB: 'breaking_news.png',
	},
	{
		localHref: '/img/blog/industry_news.png',
		nameInDB: 'industry_news.png',
	},
	{
		localHref: '/img/blog/og_1200x630.png',
		nameInDB: 'og_1200x630.png',
	},
	{
		localHref: '/img/blog/placeholder.png',
		nameInDB: 'placeholder.png',
	},
];

// If you want to add a new sort direction, add it here.

/**
 * An array of sort directions.
 * @param label - The label of the sort direction. This is what the user sees.
 * @param value - The value of the sort direction. This is what is used in the code - no spaces, lowercase.
 * @param sortKey - The key to sort by. This must be a key of the Listing type.
 * @param sortDir - The direction to sort by. This must be 'asc' or 'desc'.
 * If you want to add a new sort direction, add it here.
 */
export const SORT_DIRECTIONS: SortDirectionObject[] = [
	{
		label: 'Most Popular',
		value: 'mostPopular',
		sortKey: 'likes',
		sortDir: 'desc',
	},
	{
		label: 'Least Popular',
		value: 'leastPopular',
		sortKey: 'likes',
		sortDir: 'asc',
	},
	{
		label: 'Most Views',
		value: 'mostViews',
		sortKey: 'views',
		sortDir: 'desc',
	},
	{
		label: 'Least Views',
		value: 'leastViews',
		sortKey: 'views',
		sortDir: 'asc',
	},
	{ label: 'Newest', value: 'newest', sortKey: 'created_at', sortDir: 'desc' },
	{ label: 'Oldest', value: 'oldest', sortKey: 'created_at', sortDir: 'asc' },
	{ label: 'A-Z', value: 'az', sortKey: 'title', sortDir: 'asc' },
	{ label: 'Z-A', value: 'za', sortKey: 'title', sortDir: 'desc' },
];

export const SUBLISTING_SORT_DIRECTIONS: SublistingSortDirectionObject[] = [
	{
		label: 'Most Popular',
		value: 'mostPopular',
		sortKey: 'likes',
		sortDir: 'desc',
	},
	{
		label: 'Least Popular',
		value: 'leastPopular',
		sortKey: 'likes',
		sortDir: 'asc',
	},
	{
		label: 'Most Views',
		value: 'mostViews',
		sortKey: 'views',
		sortDir: 'desc',
	},
	{
		label: 'Least Views',
		value: 'leastViews',
		sortKey: 'views',
		sortDir: 'asc',
	},
	{ label: 'Newest', value: 'newest', sortKey: 'created_at', sortDir: 'desc' },
	{ label: 'Oldest', value: 'oldest', sortKey: 'created_at', sortDir: 'asc' },
	{ label: 'A-Z', value: 'az', sortKey: 'title', sortDir: 'asc' },
	{ label: 'Z-A', value: 'za', sortKey: 'title', sortDir: 'desc' },
];
