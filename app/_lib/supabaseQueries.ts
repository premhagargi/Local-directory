// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
// Import Data
// Import Assets & Icons

const supabase = createSupabaseBrowserClient();

export const listingParams = `
    id, created_at, default_image_url, is_promoted, owner_id, slug, title, category_id, excerpt, average_rating, ratings_count, likes, views,updated_at, click_url, clicks, description, is_admin_published, is_user_published, is_promoted, discount_code_text, discount_code_percentage, discount_code, 
    category:categories!inner(id, name, slug), logo_image_url,
    tags ( id, name, slug ),
    owner:users!owner_id(id, username, avatar_url)
    `;

export const listingQuery = supabase.from('listings').select(listingParams);

export const sublistingsParams = `
        id, created_at, default_image_url, is_promoted, listing_id, slug, title, subcategory_id, excerpt, average_rating, ratings_count, likes, views,updated_at, click_url, clicks, description, is_admin_published, is_user_published, is_promoted, price_regular_in_cents, price_promotional_in_cents, size,
        subcategory:subcategories!inner(id, name, slug), availability, finder_id,
        subtags ( id, name, slug ),
        owner:listings!listing_id(id, title, slug, excerpt, category_id, discount_code_percentage, click_url)
	`;
export const sublistingsQuery = supabase
	.from('sublistings')
	.select(sublistingsParams);

export const allTagsQuery = supabase
	.from('tags')
	.select(`id, name, slug, tag_groups ( id, name )`);

export const allSubtagsQuery = supabase
	.from('subtags')
	.select(`id, name, slug, subtag_groups ( id, name )`);

export const allCategoriesQuery = supabase
	.from('categories')
	.select(`id, name, slug, category_groups ( id, name )`);

export const allSubcategoriesQuery = supabase
	.from('subcategories')
	.select(`id, name, slug, subcategory_groups ( id, name )`);

export const allTopicQuery = supabase.from('topics').select(`id, name, slug`);

export const allTagGroupsQuery = supabase.from('tag_groups').select(`id, name`);

export const allCategoryGroupsQuery = supabase
	.from('category_groups')
	.select(`id, name`);

export const allSubtagGroupsQuery = supabase
	.from('subtag_groups')
	.select(`id, name`);

export const allSubcategoryGroupsQuery = supabase
	.from('subcategory_groups')
	.select(`id, name`);

export const fullAllTagsQuery = supabase
	.from('tags')
	.select(
		`id, name, slug, headline, description, image_url_hero, image_url_small, tag_groups ( id, name ), emoji, color, href`
	);

export const fullAllSubtagsQuery = supabase
	.from('subtags')
	.select(
		`id, name, slug, headline, description, image_url_hero, image_url_small, subtag_groups ( id, name ), emoji, color, href`
	);

export const fullAllSubcategoriesQuery = supabase
	.from('subcategories')
	.select(
		`id, name, slug, headline, description, image_url_hero, image_url_small, subcategory_groups ( id, name ), emoji, color, href`
	);

export const slugQuery = supabase.from('listings').select('slug');

export const commentQuery = supabase
	.from('comments')
	.select(
		`*, author:users(username, avatar_url), blog_post_name: blog_posts!blog_post_id(title), listing_name:listings!listing_id(title)`
	);

export const fullPromotionQuery = supabase
	.from('promotions')
	.select('*, listing:listings!inner(title), category:categories!inner(name)');

export const fullAllCategoriesQuery = supabase
	.from('categories')
	.select(
		`id, name, slug, headline, description, image_url_hero, image_url_small, category_groups ( id, name ), emoji, color, href`
	);

export const authUserQuery = supabase
	.from('users')
	.select(`id, email, is_active, role, avatar_url`);
