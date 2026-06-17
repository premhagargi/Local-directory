// Import Types
// Import External Packages
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseBrowserClient from '@/lib/createSupabaseBrowserClient';
import { QueryData } from '@supabase/supabase-js';
import {
	allCategoriesQuery,
	allCategoryGroupsQuery,
	allSubcategoriesQuery,
	allSubcategoryGroupsQuery,
	allSubtagGroupsQuery,
	allSubtagsQuery,
	allTagGroupsQuery,
	allTagsQuery,
	allTopicQuery,
	commentQuery,
	fullAllCategoriesQuery,
	fullAllSubcategoriesQuery,
	fullAllSubtagsQuery,
	fullAllTagsQuery,
	fullPromotionQuery,
	listingQuery,
	slugQuery,
	sublistingsQuery,
	authUserQuery,
} from '@/lib/supabaseQueries';
// Import Data
// Import Assets & Icons

// CUSTOME SUPABASE QUERIES to EXPORT TYPES

const supabase = createSupabaseBrowserClient();

export type ListingsType = QueryData<typeof listingQuery>;
export type ListingType = ListingsType[0];

export type SublistingsType = QueryData<typeof sublistingsQuery>;
export type SublistingType = SublistingsType[0];

export type TagType = QueryData<typeof allTagsQuery>[0];

export type SubtagType = QueryData<typeof allSubtagsQuery>[0];

export type CategoryType = QueryData<typeof allCategoriesQuery>[0];

export type SubcategoryType = QueryData<typeof allSubcategoriesQuery>[0];

export type TopicType = QueryData<typeof allTopicQuery>[0];

export type TagGroupType = QueryData<typeof allTagGroupsQuery>[0];

export type CategoryGroupType = QueryData<typeof allCategoryGroupsQuery>[0];

export type SubtagGroupType = QueryData<typeof allSubtagGroupsQuery>[0];

export type SubcategoryGroupType = QueryData<
	typeof allSubcategoryGroupsQuery
>[0];

export type FullTagType = QueryData<typeof fullAllTagsQuery>[0];

export type FullSubtagType = QueryData<typeof fullAllSubtagsQuery>[0];

export type FullCategoryType = QueryData<typeof fullAllCategoriesQuery>[0];

export type FullSubcategoryType = QueryData<
	typeof fullAllSubcategoriesQuery
>[0];

export type SlugType = QueryData<typeof slugQuery>[0];

export type FullCommentType = QueryData<typeof commentQuery>[0];

type HalfPromotionType = QueryData<typeof fullPromotionQuery>[0];

export type FullPromotionType = HalfPromotionType & {
	listing_name: string;
	category_name: string;
};

export type AuthUserType = QueryData<typeof authUserQuery>[0];
