CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

create table "public"."activities" (
    "id" uuid not null default gen_random_uuid(),
    "value" text not null,
    "created_at" timestamp with time zone default now(),
    "user_id" uuid,
    "type" text not null default '''unknown''::text'::text
);


alter table "public"."activities" enable row level security;

create table "public"."ad_campaigns" (
    "id" uuid not null default gen_random_uuid(),
    "start_date" date not null,
    "end_date" date not null,
    "invoice_id" text,
    "price" numeric,
    "contact_name" text,
    "contact_email" text,
    "redirect_url" text not null,
    "image_url" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "slot_name" text,
    "name" text
);


alter table "public"."ad_campaigns" enable row level security;

create table "public"."blog_posts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "topic_id" uuid,
    "title" text not null,
    "slug" text not null,
    "description" text not null,
    "content" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone,
    "is_admin_approved" boolean default false,
    "is_sponsored" boolean default false,
    "keywords" text[],
    "is_user_published" boolean default false,
    "default_image_url" text,
    "published_at" date
);


alter table "public"."blog_posts" enable row level security;

create table "public"."categories" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text not null,
    "slug" text not null,
    "headline" text,
    "description" text,
    "image_url_hero" text,
    "image_url_small" text, 
    "href" text,
    "color" text, 
    "emoji" text
);


alter table "public"."categories" enable row level security;


create table "public"."subcategories" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text not null,
    "slug" text not null,
    "headline" text,
    "description" text,
    "image_url_hero" text,
    "image_url_small" text, 
    "href" text,
    "color" text, 
    "emoji" text
);


alter table "public"."subcategories" enable row level security;

create table "public"."comments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "listing_id" uuid,
    "sublisting_id" uuid,
    "blog_post_id" uuid,
    "parent_comment_id" uuid,
    "content" text,
    "is_approved" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."comments" enable row level security;

create table "public"."feedback" (
    "id" uuid not null default gen_random_uuid(),
    "feedback_type" text,
    "url" text,
    "description" text,
    "email" text,
    "is_handled" boolean default false,
    "created_at" timestamp with time zone default now()
);


alter table "public"."feedback" enable row level security;

create table "public"."listings" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "title" text not null,
    "slug" text not null,
    "description" text not null,
    "excerpt" text,
    "likes" integer default 0,
    "views" integer default 0,
    "clicks" integer default 0,
    "average_rating" double precision default 0,
    "ratings_count" integer default 0,
    "click_url" text not null,
    "is_user_published" boolean default false,
    "is_admin_published" boolean default false,
    "is_promoted" boolean default false,
    "finder_id" uuid,
    "owner_id" uuid,
    "category_id" uuid,
    "default_image_url" text,
    "logo_image_url" text,
    "discount_code_text" text,
    "discount_code_percentage" text,
    "discount_code" text,
    "embedding" vector(1536),
    "fts" tsvector generated always as (to_tsvector('english'::regconfig, ((((COALESCE(title, ''::text) || ' '::text) || COALESCE(description, ''::text)) || ' '::text) || COALESCE(excerpt, ''::text)))) stored
);


alter table "public"."listings" enable row level security;

create table "public"."listings_tags" (
    "listing_id" uuid not null,
    "tag_id" uuid not null
);


alter table "public"."listings_tags" enable row level security;

create table "public"."sublistings" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "title" text not null,
    "slug" text not null,
    "price_regular_in_cents" integer,
    "price_promotional_in_cents" integer, 
    "size" text,
    "description" text not null,
    "excerpt" text,
    "likes" integer default 0,
    "views" integer default 0,
    "clicks" integer default 0,
    "average_rating" double precision default 0,
    "ratings_count" integer default 0,
    "click_url" text not null,
    "is_user_published" boolean default false,
    "is_admin_published" boolean default false,
    "is_promoted" boolean default false,
    "listing_id" uuid  not null,
    "finder_id" uuid  not null,
    "owner_id" uuid,
    "subcategory_id" uuid,
    "default_image_url" text,
        "availability" boolean default true,
    "embedding" vector(1536),
    "fts" tsvector generated always as (to_tsvector('english'::regconfig, ((((COALESCE(title, ''::text) || ' '::text) || COALESCE(description, ''::text)) || ' '::text) || COALESCE(excerpt, ''::text)))) stored
);

alter table "public"."sublistings" enable row level security;

create table "public"."sublistings_subtags" (
    "sublisting_id" uuid not null,
    "subtag_id" uuid not null
);

alter table "public"."sublistings_subtags" enable row level security;

create table "public"."promotions" (
    "id" uuid not null default gen_random_uuid(),
    "listing_id" uuid not null,
    "profile_id" uuid,
    "start_date" date not null,
    "end_date" date not null,
    "price" bigint not null,
    "is_paid" boolean default false,
    "stripe_checkout_id" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "category_id" uuid not null,
    "stripe_payment_intent" text,
    "stripe_receipt_url" text,
    "is_admin_approved" boolean not null default true
);


alter table "public"."promotions" enable row level security;

create table "public"."tags" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text not null,
    "slug" text not null,
    "headline" text,
    "description" text,
    "image_url_hero" text,
    "image_url_small" text, 
    "href" text,
    "color" text, 
    "emoji" text
);


alter table "public"."tags" enable row level security;

create table "public"."subtags" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text not null,
    "slug" text not null,
    "headline" text,
    "description" text,
    "image_url_hero" text,
    "image_url_small" text, 
    "href" text,
    "color" text, 
    "emoji" text
);

alter table "public"."subtags" enable row level security;

create table "public"."topics" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text not null,
    "slug" text not null
);


alter table "public"."topics" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "auth_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone,
    "deleted_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text,
    "email" text,
    "is_super_admin" boolean default false,
    "tag_line" text,
    "is_active" boolean default true,
    "role" text
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id);

CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug);

CREATE UNIQUE INDEX campaigns_pkey ON public.ad_campaigns USING btree (id);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);

CREATE UNIQUE INDEX subcategories_pkey ON public.subcategories USING btree (id);

CREATE UNIQUE INDEX subcategories_slug_key ON public.subcategories USING btree (slug);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX feedback_pkey ON public.feedback USING btree (id);

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);

CREATE INDEX idx_listings_category_id ON public.listings USING btree (category_id);

CREATE INDEX idx_subcategories_slug ON public.subcategories USING btree (slug);

CREATE INDEX idx_listings_embedding ON public.listings USING ivfflat (embedding) WITH (lists='100');

CREATE INDEX idx_listings_finder_id ON public.listings USING btree (finder_id);

CREATE INDEX idx_listings_is_active ON public.listings USING btree (is_user_published, is_admin_published);

CREATE INDEX idx_listings_owner_id ON public.listings USING btree (owner_id);

CREATE INDEX idx_listings_slug ON public.listings USING btree (slug);

CREATE INDEX idx_listings_tags_tag_id ON public.listings_tags USING btree (tag_id);

CREATE UNIQUE INDEX listings_tags_pkey ON public.listings_tags USING btree (listing_id, tag_id);

CREATE INDEX idx_listings_title ON public.listings USING btree (title);

CREATE INDEX idx_sublistings_subcategory_id ON public.sublistings USING btree (subcategory_id);

CREATE INDEX idx_sublistings_embedding ON public.sublistings USING ivfflat (embedding) WITH (lists='100');

CREATE INDEX idx_sublistings_is_active ON public.sublistings USING btree (is_user_published, is_admin_published);

CREATE INDEX idx_sublistings_slug ON public.sublistings USING btree (slug);

CREATE INDEX idx_sublistings_subtags_tag_id ON public.sublistings_subtags USING btree (subtag_id);

CREATE INDEX idx_sublistings_title ON public.sublistings USING btree (title);

CREATE UNIQUE INDEX idx_profiles_email ON public.users USING btree (email);

CREATE INDEX idx_profiles_full_name ON public.users USING btree (full_name);

CREATE INDEX idx_tags_slug ON public.tags USING btree (slug);

CREATE INDEX idx_subtags_slug ON public.subtags USING btree (slug);

CREATE INDEX listings_fts ON public.listings USING gin (fts);

CREATE UNIQUE INDEX listings_pkey ON public.listings USING btree (id);

CREATE UNIQUE INDEX listings_slug_key ON public.listings USING btree (slug);

CREATE INDEX sublistings_fts ON public.sublistings USING gin (fts);

CREATE UNIQUE INDEX sublistings_pkey ON public.sublistings USING btree (id);

CREATE UNIQUE INDEX sublistings_slug_key ON public.sublistings USING btree (slug);

CREATE UNIQUE INDEX sublistings_subtags_pkey ON public.sublistings_subtags USING btree (sublisting_id, subtag_id);

CREATE UNIQUE INDEX profiles_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX profiles_id_key ON public.users USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX promotions_invoice_url_key ON public.promotions USING btree (stripe_receipt_url);

CREATE UNIQUE INDEX promotions_payment_intent_key ON public.promotions USING btree (stripe_payment_intent);

CREATE UNIQUE INDEX promotions_pkey ON public.promotions USING btree (id);

CREATE UNIQUE INDEX promotions_stripe_id_key ON public.promotions USING btree (stripe_checkout_id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX tags_slug_key ON public.tags USING btree (slug);

CREATE UNIQUE INDEX subtags_pkey ON public.subtags USING btree (id);

CREATE UNIQUE INDEX subtags_slug_key ON public.subtags USING btree (slug);

CREATE UNIQUE INDEX topics_pkey ON public.topics USING btree (id);

CREATE UNIQUE INDEX topics_slug_key ON public.topics USING btree (slug);

CREATE UNIQUE INDEX user_searches_pkey ON public.activities USING btree (id);

alter table "public"."activities" add constraint "user_searches_pkey" PRIMARY KEY using index "user_searches_pkey";

alter table "public"."ad_campaigns" add constraint "campaigns_pkey" PRIMARY KEY using index "campaigns_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_pkey" PRIMARY KEY using index "blog_posts_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."subcategories" add constraint "subcategories_pkey" PRIMARY KEY using index "subcategories_pkey";

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."feedback" add constraint "feedback_pkey" PRIMARY KEY using index "feedback_pkey";

alter table "public"."listings" add constraint "listings_pkey" PRIMARY KEY using index "listings_pkey";

alter table "public"."listings_tags" add constraint "listings_tags_pkey" PRIMARY KEY using index "listings_tags_pkey";

alter table "public"."sublistings" add constraint "sublistings_pkey" PRIMARY KEY using index "sublistings_pkey";

alter table "public"."sublistings_subtags" add constraint "sublistings_subtags_pkey" PRIMARY KEY using index "sublistings_subtags_pkey";

alter table "public"."promotions" add constraint "promotions_pkey" PRIMARY KEY using index "promotions_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."subtags" add constraint "subtags_pkey" PRIMARY KEY using index "subtags_pkey";

alter table "public"."topics" add constraint "topics_pkey" PRIMARY KEY using index "topics_pkey";

alter table "public"."users" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."activities" add constraint "user_searches_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id);

alter table "public"."activities" validate constraint "user_searches_user_id_fkey";

alter table "public"."blog_posts" add constraint "blog_posts_slug_key" UNIQUE using index "blog_posts_slug_key";

alter table "public"."blog_posts" add constraint "blog_posts_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL;

alter table "public"."blog_posts" validate constraint "blog_posts_topic_id_fkey";

alter table "public"."blog_posts" add constraint "blog_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

alter table "public"."blog_posts" validate constraint "blog_posts_user_id_fkey";

alter table "public"."categories" add constraint "categories_slug_key" UNIQUE using index "categories_slug_key";

alter table "public"."subcategories" add constraint "subcategories_slug_key" UNIQUE using index "subcategories_slug_key";

alter table "public"."comments" add constraint "comments_blog_post_id_fkey" FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;

alter table "public"."comments" validate constraint "comments_blog_post_id_fkey";

alter table "public"."comments" add constraint "comments_content_check" CHECK ((char_length(content) <= 1000));

alter table "public"."comments" validate constraint "comments_content_check";

alter table "public"."comments" add constraint "comments_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;

alter table "public"."comments" validate constraint "comments_listing_id_fkey";

alter table "public"."comments" add constraint "comments_sublisting_id_fkey" FOREIGN KEY (sublisting_id) REFERENCES sublistings(id) ON DELETE CASCADE;

alter table "public"."comments" validate constraint "comments_sublisting_id_fkey";

alter table "public"."comments" add constraint "comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE;

alter table "public"."comments" validate constraint "comments_parent_comment_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."listings" add constraint "listings_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id);

alter table "public"."listings" validate constraint "listings_category_id_fkey";

alter table "public"."listings" add constraint "listings_finder_id_fkey" FOREIGN KEY (finder_id) REFERENCES users(id);

alter table "public"."listings" validate constraint "listings_finder_id_fkey";

alter table "public"."listings" add constraint "listings_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES users(id);

alter table "public"."listings" validate constraint "listings_owner_id_fkey";

alter table "public"."listings" add constraint "listings_slug_key" UNIQUE using index "listings_slug_key";

alter table "public"."listings_tags" add constraint "listings_tags_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;

alter table "public"."listings_tags" validate constraint "listings_tags_listing_id_fkey";

alter table "public"."listings_tags" add constraint "listings_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;

alter table "public"."listings_tags" validate constraint "listings_tags_tag_id_fkey";

alter table "public"."sublistings" add constraint "sublistings_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES subcategories(id);

alter table "public"."sublistings" validate constraint "sublistings_subcategory_id_fkey";

alter table "public"."sublistings" add constraint "sublistings_slug_key" UNIQUE using index "sublistings_slug_key";

alter table "public"."sublistings_subtags" add constraint "sublistings_subtags_listing_id_fkey" FOREIGN KEY (sublisting_id) REFERENCES sublistings(id) ON DELETE CASCADE;

alter table "public"."sublistings_subtags" validate constraint "sublistings_subtags_listing_id_fkey";

alter table "public"."sublistings_subtags" add constraint "sublistings_subtags_subtag_id_fkey" FOREIGN KEY (subtag_id) REFERENCES subtags(id) ON DELETE CASCADE;

alter table "public"."sublistings_subtags" validate constraint "sublistings_subtags_subtag_id_fkey";

alter table "public"."sublistings" add constraint "sublistings_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;

alter table "public"."sublistings" validate constraint "sublistings_listing_id_fkey";

alter table "public"."promotions" add constraint "promotions_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id);

alter table "public"."sublistings" add constraint "sublistings_finder_id_fkey" FOREIGN KEY (finder_id) REFERENCES users(id);

alter table "public"."sublistings" validate constraint "sublistings_finder_id_fkey";

alter table "public"."sublistings" add constraint "sublistings_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES users(id);

alter table "public"."sublistings" validate constraint "sublistings_owner_id_fkey";

alter table "public"."promotions" validate constraint "promotions_category_id_fkey";

alter table "public"."promotions" add constraint "promotions_invoice_url_key" UNIQUE using index "promotions_invoice_url_key";

alter table "public"."promotions" add constraint "promotions_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;

alter table "public"."promotions" validate constraint "promotions_listing_id_fkey";

alter table "public"."promotions" add constraint "promotions_payment_intent_key" UNIQUE using index "promotions_payment_intent_key";

alter table "public"."promotions" add constraint "promotions_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES users(id) ON DELETE CASCADE;

alter table "public"."promotions" validate constraint "promotions_profile_id_fkey";

alter table "public"."promotions" add constraint "promotions_stripe_id_key" UNIQUE using index "promotions_stripe_id_key";

alter table "public"."tags" add constraint "tags_slug_key" UNIQUE using index "tags_slug_key";

alter table "public"."subtags" add constraint "subtags_slug_key" UNIQUE using index "subtags_slug_key";

alter table "public"."topics" add constraint "topics_slug_key" UNIQUE using index "topics_slug_key";

alter table "public"."users" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_auth_id_fkey"
FOREIGN KEY (auth_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;

alter table "public"."users" validate constraint "users_auth_id_fkey";

alter table "public"."users" add constraint "profiles_id_key" UNIQUE using index "profiles_id_key";

alter table "public"."users" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."users" add constraint "username_length" CHECK ((char_length(username) >= 3));

alter table "public"."users" validate constraint "username_length";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_active_categories()
 RETURNS TABLE(id uuid, name text, slug text, category_groups jsonb)
 LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$ select distinct c.id, c.name, c.slug, COALESCE(
      jsonb_agg(
       distinct jsonb_build_object('id', cg.id, 'name', cg.name)
      ) FILTER (WHERE cg.id IS NOT NULL), 
      '[]'::jsonb
    ) AS category_groups from public.categories c INNER JOIN public.listings l on c.id = l.category_id AND l.is_user_published = true AND l.is_admin_published = true LEFT JOIN public.category_groups_categories_association cgca ON c.id = cgca.category_id
  LEFT JOIN public.category_groups cg ON cgca.category_group_id = cg.id GROUP BY c.id; $function$
;

CREATE OR REPLACE FUNCTION public.get_active_subcategories()
 RETURNS TABLE(id uuid, name text, slug text, subcategory_groups jsonb)
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$ select distinct c.id, c.name, c.slug, COALESCE(
      jsonb_agg(
       distinct jsonb_build_object('id', cg.id, 'name', cg.name)
      ) FILTER (WHERE cg.id IS NOT NULL), 
      '[]'::jsonb
    ) AS subcategory_groups from public.subcategories c INNER JOIN public.sublistings l on c.id = l.subcategory_id AND l.is_user_published = true AND l.is_admin_published = true LEFT JOIN public.subcategory_groups_subcategories_association cgca ON c.id = cgca.subcategory_id
  LEFT JOIN public.subcategory_groups cg ON cgca.subcategory_group_id = cg.id GROUP BY c.id, c.name, c.slug; $function$
;

CREATE OR REPLACE FUNCTION public.get_active_topics()
 RETURNS TABLE(id uuid, name text, slug text)
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
select
    t.id,
    t.name,
    t.slug
from
    public.topics t
where
    exists (
        select 1
        from public.blog_posts bp
        where bp.topic_id = t.id
        and bp.is_admin_approved = true
        and bp.is_user_published = true
    )
order by
    t.name;
$function$
;

CREATE OR REPLACE FUNCTION public.get_categories_with_listing_count()
 RETURNS TABLE(id uuid, name text, slug text, headline text, listing_count bigint)
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
select
    c.id,
    c.name,
    c.slug,
    c.headline,
    count(l.id) as listing_count
from
    public.categories c
left join
    public.listings l on l.category_id = c.id
where
    l.is_user_published = true
    and l.is_admin_published = true
group by
    c.id, c.name, c.slug, c.headline
order by
    c.name;
$function$
;

CREATE OR REPLACE FUNCTION public.get_subcategories_with_sublisting_count()
 RETURNS TABLE(id uuid, name text, slug text, headline text, listing_count bigint)
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
select
    c.id,
    c.name,
    c.slug,
    c.headline,
    count(l.id) as sublisting_count
from
    public.subcategories c
left join
    public.sublistings l on l.subcategory_id = c.id
where
    l.is_user_published = true
    and l.is_admin_published = true
group by
    c.id, c.name, c.slug, c.headline
order by
    c.name;
$function$
;

CREATE OR REPLACE FUNCTION public.get_full_active_categories()
 RETURNS TABLE(
   id uuid,
   name text,
   slug text,
   headline text,
   description text,
   image_url_hero text,
   image_url_small text,
   href text,
   color text,
   emoji text,
   category_groups jsonb
 )
 LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
  SELECT
    c.id,
    c.name,
    c.slug,
    c.headline,
    c.description,
    c.image_url_hero,
    c.image_url_small,
    c.href,
    c.color,
    c.emoji,
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object('id', cg.id, 'name', cg.name)
      ) FILTER (WHERE cg.id IS NOT NULL),
      '[]'::jsonb
    ) AS category_groups
  FROM public.categories c
  INNER JOIN public.listings l ON c.id = l.category_id AND l.is_user_published = true AND l.is_admin_published = true
  LEFT JOIN public.category_groups_categories_association cgca ON c.id = cgca.category_id
  LEFT JOIN public.category_groups cg ON cgca.category_group_id = cg.id
  GROUP BY
    c.id,
    c.name,
    c.slug,
    c.headline,
    c.description,
    c.image_url_hero,
    c.image_url_small,
    c.href,
    c.color,
    c.emoji;
$function$
;

CREATE OR REPLACE FUNCTION public.get_full_active_subcategories()
 RETURNS TABLE(
   id uuid,
   name text,
   slug text,
   headline text,
   description text,
   image_url_hero text,
   image_url_small text,
   href text,
   color text,
   emoji text,
   subcategory_groups jsonb
 )
 LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
  SELECT
    c.id,
    c.name,
    c.slug,
    c.headline,
    c.description,
    c.image_url_hero,
    c.image_url_small,
    c.href,
    c.color,
    c.emoji,
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object('id', cg.id, 'name', cg.name)
      ) FILTER (WHERE cg.id IS NOT NULL),
      '[]'::jsonb
    ) AS subcategory_groups
  FROM public.subcategories c
  INNER JOIN public.sublistings l ON c.id = l.subcategory_id AND l.is_user_published = true AND l.is_admin_published = true
  LEFT JOIN public.subcategory_groups_subcategories_association cgca ON c.id = cgca.subcategory_id
  LEFT JOIN public.subcategory_groups cg ON cgca.subcategory_group_id = cg.id
  GROUP BY
    c.id,
    c.name,
    c.slug,
    c.headline,
    c.description,
    c.image_url_hero,
    c.image_url_small,
    c.href,
    c.color,
    c.emoji;
$function$
;

CREATE OR REPLACE FUNCTION public.get_active_tags()
 RETURNS TABLE(
   id uuid, 
   name text, 
   slug text, 
   tag_groups jsonb
 )
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
  SELECT 
    t.id, 
    t.name, 
    t.slug,
    COALESCE(
      jsonb_agg(
        distinct jsonb_build_object('id', tg.id, 'name', tg.name)
      ) FILTER (WHERE tg.id IS NOT NULL), 
      '[]'::jsonb
    ) AS tag_groups
  FROM public.tags t
  INNER JOIN public.listings_tags lt ON t.id = lt.tag_id
  INNER JOIN public.listings l ON lt.listing_id = l.id AND l.is_user_published = true AND l.is_admin_published = true
  LEFT JOIN public.tag_groups_tags_association tgta ON t.id = tgta.tag_id
  LEFT JOIN public.tag_groups tg ON tgta.tag_group_id = tg.id
  GROUP BY t.id, t.name, t.slug;
$function$
;

CREATE OR REPLACE FUNCTION public.get_active_subtags()
 RETURNS TABLE(
   id uuid, 
   name text, 
   slug text, 
   subtag_groups jsonb
 )
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
  SELECT 
    t.id, 
    t.name, 
    t.slug,
    COALESCE(
      jsonb_agg(
       distinct jsonb_build_object('id', tg.id, 'name', tg.name)
      ) FILTER (WHERE tg.id IS NOT NULL), 
      '[]'::jsonb
    ) AS subtag_groups
  FROM public.subtags t
  INNER JOIN public.sublistings_subtags lt ON t.id = lt.subtag_id
  INNER JOIN public.sublistings l ON lt.sublisting_id = l.id AND l.is_user_published = true AND l.is_admin_published = true
  LEFT JOIN public.subtag_groups_subtags_association tgta ON t.id = tgta.subtag_id
  LEFT JOIN public.subtag_groups tg ON tgta.subtag_group_id = tg.id
  GROUP BY t.id, t.name, t.slug;
$function$
;

CREATE OR REPLACE FUNCTION public.get_full_active_subtags()
 RETURNS TABLE(
   id uuid, 
   name text, 
   slug text, 
   headline text, 
   description text, 
   image_url_hero text, 
   image_url_small text,
   href text,
   color text,
   emoji text,
   subtag_groups jsonb
 )
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$
  SELECT 
    t.id, 
    t.name, 
    t.slug, 
    t.headline, 
    t.description, 
    t.image_url_hero, 
    t.image_url_small,
    t.href,
    t.color,
    t.emoji,
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object('id', tg.id, 'name', tg.name)
      ) FILTER (WHERE tg.id IS NOT NULL), 
      '[]'::jsonb
    ) AS subtag_groups
  FROM public.subtags t
  INNER JOIN public.sublistings_subtags lt ON t.id = lt.subtag_id
  LEFT JOIN public.subtag_groups_subtags_association tgta ON t.id = tgta.subtag_id
  LEFT JOIN public.subtag_groups tg ON tgta.subtag_group_id = tg.id
  GROUP BY 
    t.id, 
    t.name, 
    t.slug, 
    t.headline, 
    t.description, 
    t.image_url_hero, 
    t.image_url_small,
    t.href,
    t.color,
    t.emoji;
$function$
;

CREATE OR REPLACE FUNCTION public.get_full_active_tags()
 RETURNS TABLE(
   id uuid, 
   name text, 
   slug text, 
   headline text, 
   description text, 
   image_url_hero text, 
   image_url_small text,
   href text,
   color text,
   emoji text,
   tag_groups jsonb
 )
 LANGUAGE sql
 STABLE
 SET search_path = ''
AS $function$
  SELECT 
    t.id, 
    t.name, 
    t.slug, 
    t.headline, 
    t.description, 
    t.image_url_hero, 
    t.image_url_small,
    t.href,
    t.color,
    t.emoji,
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object('id', tg.id, 'name', tg.name)
      ) FILTER (WHERE tg.id IS NOT NULL), 
      '[]'::jsonb
    ) AS tag_groups
  FROM public.tags t
  INNER JOIN public.listings_tags lt ON t.id = lt.tag_id
  LEFT JOIN public.tag_groups_tags_association tgta ON t.id = tgta.tag_id
  LEFT JOIN public.tag_groups tg ON tgta.tag_group_id = tg.id
  GROUP BY 
    t.id, 
    t.name, 
    t.slug, 
    t.headline, 
    t.description, 
    t.image_url_hero, 
    t.image_url_small,
    t.href,
    t.color,
    t.emoji;
$function$
;

CREATE OR REPLACE FUNCTION public.get_listing_statistics(logged_user_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
  SET search_path = ''
AS $function$declare
    result jsonb;
begin
  select jsonb_build_object(
    'total_listings', count(l.id),
    'total_promotions', coalesce(sum(l.is_promoted::int)),
    'total_likes', coalesce(sum(l.likes), 0),
    'total_views', coalesce(sum(l.views), 0),
    'total_clicks', coalesce(sum(l.clicks), 0),
    'total_ratings', coalesce(sum(l.ratings_count), 0),
    'total_claims', count(l.owner_id)
  )
  into result
  from public.listings l
  where
    (logged_user_id is null or l.finder_id = logged_user_id)
    and l.is_user_published = true
    and l.is_admin_published = true;

  return result;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_sublisting_statistics(
  logged_user_id uuid DEFAULT NULL::uuid,
  sublisting_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE plpgsql
 STABLE
  SET search_path = ''
AS $function$
declare
    result jsonb;
begin
  select jsonb_build_object(
    'total_sublistings', count(s.id),
    'total_promotions', coalesce(sum(s.is_promoted::int), 0),
    'total_likes', coalesce(sum(s.likes), 0),
    'total_views', coalesce(sum(s.views), 0),
    'total_clicks', coalesce(sum(s.clicks), 0),
    'total_ratings', coalesce(sum(s.ratings_count), 0),
    'total_claims', count(s.owner_id)
  )
  into result
  from public.sublistings s
  join public.listings l on s.listing_id = l.id
  where
    (sublisting_id is null or s.id = sublisting_id) and
    (logged_user_id is null or l.finder_id = logged_user_id)
    and l.is_user_published = true
    and l.is_admin_published = true;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_usernames()
 RETURNS TABLE(username text)
  LANGUAGE sql
 STABLE
  SET search_path = ''
AS $function$select distinct u.username
    from public.users u
    join public.listings l on u.id = l.owner_id;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
 SET search_path = ''
AS $function$
begin
 insert into public.users (id, auth_id, email, role)
 values (new.id, new.id, new.email, NEW.raw_user_meta_data ->> 'role');
 return new;
end;
$function$
;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

CREATE OR REPLACE FUNCTION public.increment_field(listing_id uuid, field_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Validate the field_name to ensure only allowed columns can be updated
    IF field_name NOT IN ('likes', 'views', 'clicks') THEN
        RAISE EXCEPTION 'Invalid field name';
    END IF;
    
    -- Safely execute the update using the validated field_name and listing_id
    EXECUTE format('UPDATE public.listings SET %I = %I + 1 WHERE id = %L', field_name, field_name, listing_id);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_field_sublisting(sublisting_id uuid, field_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Validate the field_name to ensure only allowed columns can be updated
    IF field_name NOT IN ('likes', 'views', 'clicks') THEN
        RAISE EXCEPTION 'Invalid field name';
    END IF;
    
    -- Safely execute the update using the validated field_name and sublisting_id
    EXECUTE format('UPDATE public.sublistings SET %I = %I + 1 WHERE id = %L', field_name, field_name, sublisting_id);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.match_listings(embedding vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id uuid, title text, similarity double precision)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_variable
begin
  return query
  select
    listings.id,
    listings.title,
    (listings.embedding <#> embedding) * -1 as similarity
  from public.listings

  -- The dot product is negative because of a Postgres limitation, so we negate it
  where (listings.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by listings.embedding <#> embedding

  limit match_count;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.match_sublistings(embedding vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id uuid, title text, similarity double precision)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_variable
begin
  return query
  select
    sublistings.id,
    sublistings.title,
(sublistings.embedding <#> embedding) * -1 as similarity
  from public.sublistings

  -- The dot product is negative because of a Postgres limitation, so we negate it
  where (sublistings.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by sublistings.embedding <#> embedding

  limit match_count;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_rating(listing_id uuid, new_rating numeric)
 RETURNS void
 LANGUAGE plpgsql
  SET search_path = ''
  SECURITY DEFINER
AS $function$begin
    update public.listings
    set
        ratings_count = ratings_count + 1,
        average_rating = case 
        when ratings_count = 0 then new_rating 
        else (average_rating * (ratings_count - 1) + new_rating) / ratings_count
        end
    where id = listing_id;
end;$function$
;

CREATE OR REPLACE FUNCTION public.update_rating_sublisting(sublisting_id uuid, new_rating numeric)
 RETURNS void
 LANGUAGE plpgsql
  SET search_path = ''
  SECURITY DEFINER
AS $function$begin
    update public.sublistings
    set
        ratings_count = ratings_count + 1,
        average_rating = case 
        when ratings_count = 0 then new_rating 
        else (average_rating * (ratings_count - 1) + new_rating) / ratings_count
        end
    where id = sublisting_id;
end;$function$
;

grant delete on table "public"."activities" to "anon";

grant insert on table "public"."activities" to "anon";

grant references on table "public"."activities" to "anon";

grant select on table "public"."activities" to "anon";

grant trigger on table "public"."activities" to "anon";

grant truncate on table "public"."activities" to "anon";

grant update on table "public"."activities" to "anon";

grant delete on table "public"."activities" to "authenticated";

grant insert on table "public"."activities" to "authenticated";

grant references on table "public"."activities" to "authenticated";

grant select on table "public"."activities" to "authenticated";

grant trigger on table "public"."activities" to "authenticated";

grant truncate on table "public"."activities" to "authenticated";

grant update on table "public"."activities" to "authenticated";

grant delete on table "public"."activities" to "service_role";

grant insert on table "public"."activities" to "service_role";

grant references on table "public"."activities" to "service_role";

grant select on table "public"."activities" to "service_role";

grant trigger on table "public"."activities" to "service_role";

grant truncate on table "public"."activities" to "service_role";

grant update on table "public"."activities" to "service_role";

grant delete on table "public"."ad_campaigns" to "anon";

grant insert on table "public"."ad_campaigns" to "anon";

grant references on table "public"."ad_campaigns" to "anon";

grant select on table "public"."ad_campaigns" to "anon";

grant trigger on table "public"."ad_campaigns" to "anon";

grant truncate on table "public"."ad_campaigns" to "anon";

grant update on table "public"."ad_campaigns" to "anon";

grant delete on table "public"."ad_campaigns" to "authenticated";

grant insert on table "public"."ad_campaigns" to "authenticated";

grant references on table "public"."ad_campaigns" to "authenticated";

grant select on table "public"."ad_campaigns" to "authenticated";

grant trigger on table "public"."ad_campaigns" to "authenticated";

grant truncate on table "public"."ad_campaigns" to "authenticated";

grant update on table "public"."ad_campaigns" to "authenticated";

grant delete on table "public"."ad_campaigns" to "service_role";

grant insert on table "public"."ad_campaigns" to "service_role";

grant references on table "public"."ad_campaigns" to "service_role";

grant select on table "public"."ad_campaigns" to "service_role";

grant trigger on table "public"."ad_campaigns" to "service_role";

grant truncate on table "public"."ad_campaigns" to "service_role";

grant update on table "public"."ad_campaigns" to "service_role";

grant delete on table "public"."blog_posts" to "anon";

grant insert on table "public"."blog_posts" to "anon";

grant references on table "public"."blog_posts" to "anon";

grant select on table "public"."blog_posts" to "anon";

grant trigger on table "public"."blog_posts" to "anon";

grant truncate on table "public"."blog_posts" to "anon";

grant update on table "public"."blog_posts" to "anon";

grant delete on table "public"."blog_posts" to "authenticated";

grant insert on table "public"."blog_posts" to "authenticated";

grant references on table "public"."blog_posts" to "authenticated";

grant select on table "public"."blog_posts" to "authenticated";

grant trigger on table "public"."blog_posts" to "authenticated";

grant truncate on table "public"."blog_posts" to "authenticated";

grant update on table "public"."blog_posts" to "authenticated";

grant delete on table "public"."blog_posts" to "service_role";

grant insert on table "public"."blog_posts" to "service_role";

grant references on table "public"."blog_posts" to "service_role";

grant select on table "public"."blog_posts" to "service_role";

grant trigger on table "public"."blog_posts" to "service_role";

grant truncate on table "public"."blog_posts" to "service_role";

grant update on table "public"."blog_posts" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."subcategories" to "anon";

grant insert on table "public"."subcategories" to "anon";

grant references on table "public"."subcategories" to "anon";

grant select on table "public"."subcategories" to "anon";

grant trigger on table "public"."subcategories" to "anon";

grant truncate on table "public"."subcategories" to "anon";

grant update on table "public"."subcategories" to "anon";

grant delete on table "public"."subcategories" to "authenticated";

grant insert on table "public"."subcategories" to "authenticated";

grant references on table "public"."subcategories" to "authenticated";

grant select on table "public"."subcategories" to "authenticated";

grant trigger on table "public"."subcategories" to "authenticated";

grant truncate on table "public"."subcategories" to "authenticated";

grant update on table "public"."subcategories" to "authenticated";

grant delete on table "public"."subcategories" to "service_role";

grant insert on table "public"."subcategories" to "service_role";

grant references on table "public"."subcategories" to "service_role";

grant select on table "public"."subcategories" to "service_role";

grant trigger on table "public"."subcategories" to "service_role";

grant truncate on table "public"."subcategories" to "service_role";

grant update on table "public"."subcategories" to "service_role";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."feedback" to "anon";

grant insert on table "public"."feedback" to "anon";

grant references on table "public"."feedback" to "anon";

grant select on table "public"."feedback" to "anon";

grant trigger on table "public"."feedback" to "anon";

grant truncate on table "public"."feedback" to "anon";

grant update on table "public"."feedback" to "anon";

grant delete on table "public"."feedback" to "authenticated";

grant insert on table "public"."feedback" to "authenticated";

grant references on table "public"."feedback" to "authenticated";

grant select on table "public"."feedback" to "authenticated";

grant trigger on table "public"."feedback" to "authenticated";

grant truncate on table "public"."feedback" to "authenticated";

grant update on table "public"."feedback" to "authenticated";

grant delete on table "public"."feedback" to "service_role";

grant insert on table "public"."feedback" to "service_role";

grant references on table "public"."feedback" to "service_role";

grant select on table "public"."feedback" to "service_role";

grant trigger on table "public"."feedback" to "service_role";

grant truncate on table "public"."feedback" to "service_role";

grant update on table "public"."feedback" to "service_role";

grant delete on table "public"."listings" to "anon";

grant insert on table "public"."listings" to "anon";

grant references on table "public"."listings" to "anon";

grant select on table "public"."listings" to "anon";

grant trigger on table "public"."listings" to "anon";

grant truncate on table "public"."listings" to "anon";

grant update on table "public"."listings" to "anon";

grant delete on table "public"."listings" to "authenticated";

grant insert on table "public"."listings" to "authenticated";

grant references on table "public"."listings" to "authenticated";

grant select on table "public"."listings" to "authenticated";

grant trigger on table "public"."listings" to "authenticated";

grant truncate on table "public"."listings" to "authenticated";

grant update on table "public"."listings" to "authenticated";

grant delete on table "public"."listings" to "service_role";

grant insert on table "public"."listings" to "service_role";

grant references on table "public"."listings" to "service_role";

grant select on table "public"."listings" to "service_role";

grant trigger on table "public"."listings" to "service_role";

grant truncate on table "public"."listings" to "service_role";

grant update on table "public"."listings" to "service_role";

grant delete on table "public"."listings_tags" to "anon";

grant insert on table "public"."listings_tags" to "anon";

grant references on table "public"."listings_tags" to "anon";

grant select on table "public"."listings_tags" to "anon";

grant trigger on table "public"."listings_tags" to "anon";

grant truncate on table "public"."listings_tags" to "anon";

grant update on table "public"."listings_tags" to "anon";

grant delete on table "public"."listings_tags" to "authenticated";

grant insert on table "public"."listings_tags" to "authenticated";

grant references on table "public"."listings_tags" to "authenticated";

grant select on table "public"."listings_tags" to "authenticated";

grant trigger on table "public"."listings_tags" to "authenticated";

grant truncate on table "public"."listings_tags" to "authenticated";

grant update on table "public"."listings_tags" to "authenticated";

grant delete on table "public"."listings_tags" to "service_role";

grant insert on table "public"."listings_tags" to "service_role";

grant references on table "public"."listings_tags" to "service_role";

grant select on table "public"."listings_tags" to "service_role";

grant trigger on table "public"."listings_tags" to "service_role";

grant truncate on table "public"."listings_tags" to "service_role";

grant update on table "public"."listings_tags" to "service_role";


grant delete on table "public"."sublistings" to "anon";

grant insert on table "public"."sublistings" to "anon";

grant references on table "public"."sublistings" to "anon";

grant select on table "public"."sublistings" to "anon";

grant trigger on table "public"."sublistings" to "anon";

grant truncate on table "public"."sublistings" to "anon";

grant update on table "public"."sublistings" to "anon";

grant delete on table "public"."sublistings" to "authenticated";

grant insert on table "public"."sublistings" to "authenticated";

grant references on table "public"."sublistings" to "authenticated";

grant select on table "public"."sublistings" to "authenticated";

grant trigger on table "public"."sublistings" to "authenticated";

grant truncate on table "public"."sublistings" to "authenticated";

grant update on table "public"."sublistings" to "authenticated";

grant delete on table "public"."sublistings" to "service_role";

grant insert on table "public"."sublistings" to "service_role";

grant references on table "public"."sublistings" to "service_role";

grant select on table "public"."sublistings" to "service_role";

grant trigger on table "public"."sublistings" to "service_role";

grant truncate on table "public"."sublistings" to "service_role";

grant update on table "public"."sublistings" to "service_role";

grant delete on table "public"."sublistings_subtags" to "anon";

grant insert on table "public"."sublistings_subtags" to "anon";

grant references on table "public"."sublistings_subtags" to "anon";

grant select on table "public"."sublistings_subtags" to "anon";

grant trigger on table "public"."sublistings_subtags" to "anon";

grant truncate on table "public"."sublistings_subtags" to "anon";

grant update on table "public"."sublistings_subtags" to "anon";

grant delete on table "public"."sublistings_subtags" to "authenticated";

grant insert on table "public"."sublistings_subtags" to "authenticated";

grant references on table "public"."sublistings_subtags" to "authenticated";

grant select on table "public"."sublistings_subtags" to "authenticated";

grant trigger on table "public"."sublistings_subtags" to "authenticated";

grant truncate on table "public"."sublistings_subtags" to "authenticated";

grant update on table "public"."sublistings_subtags" to "authenticated";

grant delete on table "public"."sublistings_subtags" to "service_role";

grant insert on table "public"."sublistings_subtags" to "service_role";

grant references on table "public"."sublistings_subtags" to "service_role";

grant select on table "public"."sublistings_subtags" to "service_role";

grant trigger on table "public"."sublistings_subtags" to "service_role";

grant truncate on table "public"."sublistings_subtags" to "service_role";

grant update on table "public"."sublistings_subtags" to "service_role";


grant delete on table "public"."promotions" to "anon";

grant insert on table "public"."promotions" to "anon";

grant references on table "public"."promotions" to "anon";

grant select on table "public"."promotions" to "anon";

grant trigger on table "public"."promotions" to "anon";

grant truncate on table "public"."promotions" to "anon";

grant update on table "public"."promotions" to "anon";

grant delete on table "public"."promotions" to "authenticated";

grant insert on table "public"."promotions" to "authenticated";

grant references on table "public"."promotions" to "authenticated";

grant select on table "public"."promotions" to "authenticated";

grant trigger on table "public"."promotions" to "authenticated";

grant truncate on table "public"."promotions" to "authenticated";

grant update on table "public"."promotions" to "authenticated";

grant delete on table "public"."promotions" to "service_role";

grant insert on table "public"."promotions" to "service_role";

grant references on table "public"."promotions" to "service_role";

grant select on table "public"."promotions" to "service_role";

grant trigger on table "public"."promotions" to "service_role";

grant truncate on table "public"."promotions" to "service_role";

grant update on table "public"."promotions" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";


grant delete on table "public"."subtags" to "anon";

grant insert on table "public"."subtags" to "anon";

grant references on table "public"."subtags" to "anon";

grant select on table "public"."subtags" to "anon";

grant trigger on table "public"."subtags" to "anon";

grant truncate on table "public"."subtags" to "anon";

grant update on table "public"."subtags" to "anon";

grant delete on table "public"."subtags" to "authenticated";

grant insert on table "public"."subtags" to "authenticated";

grant references on table "public"."subtags" to "authenticated";

grant select on table "public"."subtags" to "authenticated";

grant trigger on table "public"."subtags" to "authenticated";

grant truncate on table "public"."subtags" to "authenticated";

grant update on table "public"."subtags" to "authenticated";

grant delete on table "public"."subtags" to "service_role";

grant insert on table "public"."subtags" to "service_role";

grant references on table "public"."subtags" to "service_role";

grant select on table "public"."subtags" to "service_role";

grant trigger on table "public"."subtags" to "service_role";

grant truncate on table "public"."subtags" to "service_role";

grant update on table "public"."subtags" to "service_role";

grant delete on table "public"."topics" to "anon";

grant insert on table "public"."topics" to "anon";

grant references on table "public"."topics" to "anon";

grant select on table "public"."topics" to "anon";

grant trigger on table "public"."topics" to "anon";

grant truncate on table "public"."topics" to "anon";

grant update on table "public"."topics" to "anon";

grant delete on table "public"."topics" to "authenticated";

grant insert on table "public"."topics" to "authenticated";

grant references on table "public"."topics" to "authenticated";

grant select on table "public"."topics" to "authenticated";

grant trigger on table "public"."topics" to "authenticated";

grant truncate on table "public"."topics" to "authenticated";

grant update on table "public"."topics" to "authenticated";

grant delete on table "public"."topics" to "service_role";

grant insert on table "public"."topics" to "service_role";

grant references on table "public"."topics" to "service_role";

grant select on table "public"."topics" to "service_role";

grant trigger on table "public"."topics" to "service_role";

grant truncate on table "public"."topics" to "service_role";

grant update on table "public"."topics" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Allow admin users to delete user searches"
on "public"."activities"
as permissive
for delete
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to select user searches"
on "public"."activities"
as permissive
for select
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to update user searches"
on "public"."activities"
as permissive
for update
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow everyone to insert user searches"
on "public"."activities"
as permissive
for insert
to public
with check (true);


create policy "Allow admin users to delete campaigns"
on "public"."ad_campaigns"
as permissive
for delete
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to insert campaigns"
on "public"."ad_campaigns"
as permissive
for insert
to public
with check  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to update campaigns"
on "public"."ad_campaigns"
as permissive
for update
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Enable read access for all users"
on "public"."ad_campaigns"
as permissive
for select
to public
using (true);


create policy "Public can view published blog posts"
on "public"."blog_posts"
as permissive
for select
to public
using ((is_admin_approved = true));


create policy "Super-admins can manage all blog posts"
on "public"."blog_posts"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Users can manage their own blog posts"
on "public"."blog_posts"
as permissive
for all
to public
using ((SELECT auth.uid()) = user_id)
with check ((SELECT auth.uid()) = user_id);


create policy "Public categories are viewable by everyone."
on "public"."categories"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage categories"
on "public"."categories"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));

  create policy "Public subcategories are viewable by everyone."
on "public"."subcategories"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage subcategories"
on "public"."subcategories"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to delete comments"
on "public"."comments"
as permissive
for delete
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to select all comments"
on "public"."comments"
as permissive
for select
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to update comments"
on "public"."comments"
as permissive
for update
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow authenticated users to insert comments"
on "public"."comments"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to select approved comments"
on "public"."comments"
as permissive
for select
to public
using ((is_approved = true));


create policy "Allow admin users to delete feedback"
on "public"."feedback"
as permissive
for delete
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to select feedback"
on "public"."feedback"
as permissive
for select
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow admin users to update feedback"
on "public"."feedback"
as permissive
for update
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow everyone to insert feedback"
on "public"."feedback"
as permissive
for insert
to public
with check (true);


create policy "Public listings are viewable by everyone."
on "public"."listings"
as permissive
for select
to public
using (true);


create policy "Super admins can update any listing"
on "public"."listings"
as permissive
for update
to public
using ((auth.uid() = ( SELECT users.id
   FROM users
  WHERE ((users.id = auth.uid()) AND users.is_super_admin))));


create policy "Users can insert their own listing."
on "public"."listings"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = finder_id));


create policy "Users can update their own listing."
on "public"."listings"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = finder_id));


create policy "Allow authenticated users to delete listings_tags"
on "public"."listings_tags"
as permissive
for delete
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to insert listings_tags"
on "public"."listings_tags"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);



create policy "Allow authenticated users to update listings_tags"
on "public"."listings_tags"
as permissive
for update
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to select listings_tags"
on "public"."listings_tags"
as permissive
for select
to public
using (true);



create policy "Public sublistings are viewable by everyone."
on "public"."sublistings"
as permissive
for select
to public
using (true);


create policy "Super admins can update any sublisting"
on "public"."sublistings"
as permissive
for update
to public
using ((auth.uid() = ( SELECT users.id
   FROM users
  WHERE ((users.id = auth.uid()) AND users.is_super_admin))));


create policy "Users can insert their own sublisting."
on "public"."sublistings"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = finder_id));



create policy "Users can update their own sublisting."
on "public"."sublistings"
as permissive
for update
to public
with check ((( SELECT auth.uid() AS uid) = finder_id));



create policy "Allow authenticated users to delete sublistings_subtags"
on "public"."sublistings_subtags"
as permissive
for delete
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to insert sublistings_subtags"
on "public"."sublistings_subtags"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to select sublistings_subtags"
on "public"."sublistings_subtags"
as permissive
for select
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to update listing_subtags"
on "public"."sublistings_subtags"
as permissive
for update
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to select sublistings_subtags"
on "public"."sublistings_subtags"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."sublistings_subtags"
as permissive
for select
to public
using (true);


create policy "Allow admins to delete promotions"
on "public"."promotions"
as permissive
for delete
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Allow authenticated users to insert promotions"
on "public"."promotions"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to update promotions"
on "public"."promotions"
as permissive
for update
to public
using (true);


create policy "Allow users to select their promotions"
on "public"."promotions"
as permissive
for select
to public
using (true);


create policy "Public tags are viewable by everyone."
on "public"."tags"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage tags"
on "public"."tags"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));

  create policy "Public subtags are viewable by everyone."
on "public"."subtags"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage subtags"
on "public"."subtags"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Public topics are viewable by everyone."
on "public"."topics"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage topics"
on "public"."topics"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Public profiles are viewable by everyone."
on "public"."users"
as permissive
for select
to public
using (true);


create policy "Super-admins can update any profile field"
on "public"."users"
as permissive
for update
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


create policy "Users can insert their own profile."
on "public"."users"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update own profile."
on "public"."users"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update their own profile except is_super_admin"
on "public"."users"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));

create policy "Allow admin users to delete ad images"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'ad_images'::text) AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND (EXISTS (
    SELECT 1
    FROM users
    WHERE (users.id = (SELECT auth.uid())) AND (users.is_super_admin = true)
  ))
);


create policy "Allow admin users to update ad images"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'ad_images'::text) AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND (EXISTS (
    SELECT 1
    FROM users
    WHERE (users.id = (SELECT auth.uid())) AND (users.is_super_admin = true)
  ))
);


create policy "Allow admin users to upload ad images"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'ad_images'::text) AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND (EXISTS (
    SELECT 1
    FROM users
    WHERE (users.id = (SELECT auth.uid())) AND (users.is_super_admin = true)
  ))
);


create policy "Allow authenticated Users to delete their listing images"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'listing_images'::text)   AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND ((SELECT auth.uid()) = owner)
));


create policy "Allow authenticated Users to insert listing images"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'listing_images'::text) AND (( SELECT auth.role()) = 'authenticated'::text)));

create policy "Allow authenticated Users to insert sublisting images"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'sublisting_images'::text) AND (( SELECT auth.role()) = 'authenticated'::text)));


create policy "Allow authenticated users to delete their blog images"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'blog_images'::text)   AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND ((SELECT auth.uid()) = owner)
));


create policy "Allow authenticated users to update their blog images"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'blog_images'::text)   AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND ((SELECT auth.uid()) = owner)
));


create policy "Allow authenticated users to upload blog images"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'blog_images'::text) AND (( SELECT auth.role()) = 'authenticated'::text)));

create policy "Allow read access to blog images"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'blog_images'::text));

create policy "Allow read access to ad images"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'ad_images'::text));


create policy "Anyone can update their own avatar."
on "storage"."objects"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = owner))
with check ((bucket_id = 'avatars'::text));


create policy "Anyone can update their own listing image."
on "storage"."objects"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = owner))
with check ((bucket_id = 'listing_images'::text));


create policy "Anyone can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Authenticated Users can update listing images"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'listing_images'::text)   AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND ((SELECT auth.uid()) = owner)
));

create policy "Authenticated Users can update sublisting images"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'sublisting_images'::text)   AND ((SELECT auth.role()) = 'authenticated'::text) 
  AND ((SELECT auth.uid()) = owner)
));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));

create policy "Listing images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'listing_images'::text));


create policy "Sublisting images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'sublisting_images'::text));




create policy "Allow read access to cattag images"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'cattag_images'::text));

create policy "Allow admin users to delete cattag images"
on "storage"."objects"
as permissive
for delete
to public
using (
    (bucket_id = 'cattag_images'::text) 
    AND (auth.role() = 'authenticated'::text) 
    AND (EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid() 
        AND users.is_super_admin = true
    ))
);


create policy "Allow admin users to update cattag images"
on "storage"."objects"
as permissive
for update
to public
using (
    (bucket_id = 'cattag_images'::text) 
    AND (auth.role() = 'authenticated'::text) 
    AND (EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid() 
        AND users.is_super_admin = true
    ))
);



create policy "Allow admin users to upload cattag images"
on "storage"."objects"
as permissive
for insert
to public
with check (
    (bucket_id = 'cattag_images'::text) 
    AND (auth.role() = 'authenticated'::text) 
    AND (EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid() 
        AND users.is_super_admin = true
    ))
);





  create table tag_groups (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table "public"."tag_groups" enable row level security;


create table tag_groups_tags_association (
    tag_id uuid references tags(id) on delete cascade,
    tag_group_id uuid references tag_groups(id) on delete cascade,
    primary key (tag_id, tag_group_id)
);

alter table "public"."tag_groups_tags_association" enable row level security;

CREATE UNIQUE INDEX idx_tag_groups_id on tag_groups(id);
CREATE UNIQUE INDEX idx_tag_groups_tags_associations on tag_groups_tags_association(tag_id, tag_group_id);


grant delete on table "public"."tag_groups" to "anon";

grant insert on table "public"."tag_groups" to "anon";

grant references on table "public"."tag_groups" to "anon";

grant select on table "public"."tag_groups" to "anon";

grant trigger on table "public"."tag_groups" to "anon";

grant truncate on table "public"."tag_groups" to "anon";

grant update on table "public"."tag_groups" to "anon";

grant delete on table "public"."tag_groups" to "authenticated";

grant insert on table "public"."tag_groups" to "authenticated";

grant references on table "public"."tag_groups" to "authenticated";

grant select on table "public"."tag_groups" to "authenticated";

grant trigger on table "public"."tag_groups" to "authenticated";

grant truncate on table "public"."tag_groups" to "authenticated";

grant update on table "public"."tag_groups" to "authenticated";

grant delete on table "public"."tag_groups" to "service_role";

grant insert on table "public"."tag_groups" to "service_role";

grant references on table "public"."tag_groups" to "service_role";

grant select on table "public"."tag_groups" to "service_role";

grant trigger on table "public"."tag_groups" to "service_role";

grant truncate on table "public"."tag_groups" to "service_role";

grant update on table "public"."tag_groups" to "service_role";


create policy "Public tag_groups are viewable by everyone."
on "public"."tag_groups"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage tag_groups"
on "public"."tag_groups"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));




   create table subtag_groups (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table "public"."subtag_groups" enable row level security;


create table subtag_groups_subtags_association (
    subtag_id uuid references subtags(id) on delete cascade,
    subtag_group_id uuid references subtag_groups(id) on delete cascade,
    primary key (subtag_id, subtag_group_id)
);

alter table "public"."subtag_groups_subtags_association" enable row level security;

CREATE UNIQUE INDEX idx_subtag_groups_id on tag_groups(id);
CREATE UNIQUE INDEX idx_subtag_groups_subtags_association on subtag_groups_subtags_association(subtag_id, subtag_group_id);

grant delete on table "public"."subtag_groups" to "anon";

grant insert on table "public"."subtag_groups" to "anon";

grant references on table "public"."subtag_groups" to "anon";

grant select on table "public"."subtag_groups" to "anon";

grant trigger on table "public"."subtag_groups" to "anon";

grant truncate on table "public"."subtag_groups" to "anon";

grant update on table "public"."subtag_groups" to "anon";

grant delete on table "public"."subtag_groups" to "authenticated";

grant insert on table "public"."subtag_groups" to "authenticated";

grant references on table "public"."subtag_groups" to "authenticated";

grant select on table "public"."subtag_groups" to "authenticated";

grant trigger on table "public"."subtag_groups" to "authenticated";

grant truncate on table "public"."subtag_groups" to "authenticated";

grant update on table "public"."subtag_groups" to "authenticated";

grant delete on table "public"."subtag_groups" to "service_role";

grant insert on table "public"."subtag_groups" to "service_role";

grant references on table "public"."subtag_groups" to "service_role";

grant select on table "public"."subtag_groups" to "service_role";

grant trigger on table "public"."subtag_groups" to "service_role";

grant truncate on table "public"."subtag_groups" to "service_role";

grant update on table "public"."subtag_groups" to "service_role";

create policy "Public subtag_groups are viewable by everyone."
on "public"."subtag_groups"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage subtag_groups"
on "public"."subtag_groups"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));




  create policy "Allow authenticated users to delete tag_groups_tags_association"
on "public"."tag_groups_tags_association"
as permissive
for delete
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to insert tag_groups_tags_association"
on "public"."tag_groups_tags_association"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);



create policy "Allow authenticated users to update tag_groups_tags_association"
on "public"."tag_groups_tags_association"
as permissive
for update
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to select tag_groups_tags_association"
on "public"."tag_groups_tags_association"
as permissive
for select
to public
using (true);



  create policy "Allow authenticated users to delete subtag_groups_subtags_association"
on "public"."subtag_groups_subtags_association"
as permissive
for delete
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to insert subtag_groups_subtags_association"
on "public"."subtag_groups_subtags_association"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);



create policy "Allow authenticated users to update subtag_groups_subtags_association"
on "public"."subtag_groups_subtags_association"
as permissive
for update
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to select subtag_groups_subtags_association"
on "public"."subtag_groups_subtags_association"
as permissive
for select
to public
using (true);


-- CATEGORY-GROUPS

  create table category_groups (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table "public"."category_groups" enable row level security;


create table category_groups_categories_association (
    category_id uuid references categories(id) on delete cascade,
    category_group_id uuid references category_groups(id) on delete cascade,
    primary key (category_id, category_group_id)
);

alter table "public"."category_groups_categories_association" enable row level security;

CREATE UNIQUE INDEX idx_category_groups_id on category_groups(id);
CREATE UNIQUE INDEX idx_category_groups_categories_associations on category_groups_categories_association(category_id, category_group_id);


grant delete on table "public"."category_groups" to "anon";

grant insert on table "public"."category_groups" to "anon";

grant references on table "public"."category_groups" to "anon";

grant select on table "public"."category_groups" to "anon";

grant trigger on table "public"."category_groups" to "anon";

grant truncate on table "public"."category_groups" to "anon";

grant update on table "public"."category_groups" to "anon";

grant delete on table "public"."category_groups" to "authenticated";

grant insert on table "public"."category_groups" to "authenticated";

grant references on table "public"."category_groups" to "authenticated";

grant select on table "public"."category_groups" to "authenticated";

grant trigger on table "public"."category_groups" to "authenticated";

grant truncate on table "public"."category_groups" to "authenticated";

grant update on table "public"."category_groups" to "authenticated";

grant delete on table "public"."category_groups" to "service_role";

grant insert on table "public"."category_groups" to "service_role";

grant references on table "public"."category_groups" to "service_role";

grant select on table "public"."category_groups" to "service_role";

grant trigger on table "public"."category_groups" to "service_role";

grant truncate on table "public"."category_groups" to "service_role";

grant update on table "public"."category_groups" to "service_role";


create policy "Public category_groups are viewable by everyone."
on "public"."category_groups"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage category_groups"
on "public"."category_groups"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));


-- SUBCATEGORY-GROUPS

   create table subcategory_groups (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table "public"."subcategory_groups" enable row level security;


create table subcategory_groups_subcategories_association (
    subcategory_id uuid references subcategories(id) on delete cascade,
    subcategory_group_id uuid references subcategory_groups(id) on delete cascade,
    primary key (subcategory_id, subcategory_group_id)
);

alter table "public"."subcategory_groups_subcategories_association" enable row level security;

CREATE UNIQUE INDEX idx_subcategory_groups_id on subcategory_groups(id);
CREATE UNIQUE INDEX idx_subcategory_groups_subcategories_association_subcategory_id on subcategory_groups_subcategories_association(subcategory_id, subcategory_group_id);


grant delete on table "public"."subcategory_groups" to "anon";

grant insert on table "public"."subcategory_groups" to "anon";

grant references on table "public"."subcategory_groups" to "anon";

grant select on table "public"."subcategory_groups" to "anon";

grant trigger on table "public"."subcategory_groups" to "anon";

grant truncate on table "public"."subcategory_groups" to "anon";

grant update on table "public"."subcategory_groups" to "anon";

grant delete on table "public"."subcategory_groups" to "authenticated";

grant insert on table "public"."subcategory_groups" to "authenticated";

grant references on table "public"."subcategory_groups" to "authenticated";

grant select on table "public"."subcategory_groups" to "authenticated";

grant trigger on table "public"."subcategory_groups" to "authenticated";

grant truncate on table "public"."subcategory_groups" to "authenticated";

grant update on table "public"."subcategory_groups" to "authenticated";

grant delete on table "public"."subcategory_groups" to "service_role";

grant insert on table "public"."subcategory_groups" to "service_role";

grant references on table "public"."subcategory_groups" to "service_role";

grant select on table "public"."subcategory_groups" to "service_role";

grant trigger on table "public"."subcategory_groups" to "service_role";

grant truncate on table "public"."subcategory_groups" to "service_role";

grant update on table "public"."subcategory_groups" to "service_role";

create policy "Public subcategory_groups are viewable by everyone."
on "public"."subcategory_groups"
as permissive
for select
to public
using (true);


create policy "Super-admins can manage subcategory_groups"
on "public"."subcategory_groups"
as permissive
for all
to public
using  (( SELECT auth.uid() AS uid) IN ( SELECT users.id
   FROM users
  WHERE (users.is_super_admin = true)));




  create policy "Allow authenticated users to delete category_groups_categories_association"
on "public"."category_groups_categories_association"
as permissive
for delete
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to insert category_groups_categories_association"
on "public"."category_groups_categories_association"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);



create policy "Allow authenticated users to update category_groups_categories_association"
on "public"."category_groups_categories_association"
as permissive
for update
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to select category_groups_categories_association"
on "public"."category_groups_categories_association"
as permissive
for select
to public
using (true);



  create policy "Allow authenticated users to delete subcategory_groups_csubategories_association"
on "public"."subcategory_groups_subcategories_association"
as permissive
for delete
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow authenticated users to insert subcategory_groups_subcategories_association"
on "public"."subcategory_groups_subcategories_association"
as permissive
for insert
to public
 with check ((SELECT auth.role()) = 'authenticated'::text);



create policy "Allow authenticated users to update subcategory_groups_subcategories_association"
on "public"."subcategory_groups_subcategories_association"
as permissive
for update
to public
using ((SELECT auth.role()) = 'authenticated'::text);


create policy "Allow everyone to select subcategory_groups_subcategories_association"
on "public"."subcategory_groups_subcategories_association"
as permissive
for select
to public
using (true);