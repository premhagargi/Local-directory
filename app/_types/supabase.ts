export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			activities: {
				Row: {
					created_at: string | null;
					id: string;
					type: string;
					user_id: string | null;
					value: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					type?: string;
					user_id?: string | null;
					value: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					type?: string;
					user_id?: string | null;
					value?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_searches_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			ad_campaigns: {
				Row: {
					contact_email: string | null;
					contact_name: string | null;
					created_at: string | null;
					end_date: string;
					id: string;
					image_url: string;
					invoice_id: string | null;
					name: string | null;
					price: number | null;
					redirect_url: string;
					slot_name: string | null;
					start_date: string;
					updated_at: string | null;
				};
				Insert: {
					contact_email?: string | null;
					contact_name?: string | null;
					created_at?: string | null;
					end_date: string;
					id?: string;
					image_url: string;
					invoice_id?: string | null;
					name?: string | null;
					price?: number | null;
					redirect_url: string;
					slot_name?: string | null;
					start_date: string;
					updated_at?: string | null;
				};
				Update: {
					contact_email?: string | null;
					contact_name?: string | null;
					created_at?: string | null;
					end_date?: string;
					id?: string;
					image_url?: string;
					invoice_id?: string | null;
					name?: string | null;
					price?: number | null;
					redirect_url?: string;
					slot_name?: string | null;
					start_date?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			blog_posts: {
				Row: {
					content: string;
					created_at: string | null;
					default_image_url: string | null;
					description: string;
					id: string;
					is_admin_approved: boolean | null;
					is_sponsored: boolean | null;
					is_user_published: boolean | null;
					keywords: string[] | null;
					published_at: string | null;
					slug: string;
					title: string;
					topic_id: string | null;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					content: string;
					created_at?: string | null;
					default_image_url?: string | null;
					description: string;
					id?: string;
					is_admin_approved?: boolean | null;
					is_sponsored?: boolean | null;
					is_user_published?: boolean | null;
					keywords?: string[] | null;
					published_at?: string | null;
					slug: string;
					title: string;
					topic_id?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					content?: string;
					created_at?: string | null;
					default_image_url?: string | null;
					description?: string;
					id?: string;
					is_admin_approved?: boolean | null;
					is_sponsored?: boolean | null;
					is_user_published?: boolean | null;
					keywords?: string[] | null;
					published_at?: string | null;
					slug?: string;
					title?: string;
					topic_id?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'blog_posts_topic_id_fkey';
						columns: ['topic_id'];
						isOneToOne: false;
						referencedRelation: 'topics';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_posts_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			categories: {
				Row: {
					color: string | null;
					created_at: string | null;
					description: string | null;
					emoji: string | null;
					headline: string | null;
					href: string | null;
					id: string;
					image_url_hero: string | null;
					image_url_small: string | null;
					name: string;
					slug: string;
					updated_at: string | null;
				};
				Insert: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name: string;
					slug: string;
					updated_at?: string | null;
				};
				Update: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name?: string;
					slug?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			category_groups: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			category_groups_categories_association: {
				Row: {
					category_group_id: string;
					category_id: string;
				};
				Insert: {
					category_group_id: string;
					category_id: string;
				};
				Update: {
					category_group_id?: string;
					category_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'category_groups_categories_association_category_group_id_fkey';
						columns: ['category_group_id'];
						isOneToOne: false;
						referencedRelation: 'category_groups';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'category_groups_categories_association_category_id_fkey';
						columns: ['category_id'];
						isOneToOne: false;
						referencedRelation: 'categories';
						referencedColumns: ['id'];
					}
				];
			};
			comments: {
				Row: {
					blog_post_id: string | null;
					content: string | null;
					created_at: string | null;
					id: string;
					is_approved: boolean | null;
					listing_id: string | null;
					parent_comment_id: string | null;
					sublisting_id: string | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					blog_post_id?: string | null;
					content?: string | null;
					created_at?: string | null;
					id?: string;
					is_approved?: boolean | null;
					listing_id?: string | null;
					parent_comment_id?: string | null;
					sublisting_id?: string | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					blog_post_id?: string | null;
					content?: string | null;
					created_at?: string | null;
					id?: string;
					is_approved?: boolean | null;
					listing_id?: string | null;
					parent_comment_id?: string | null;
					sublisting_id?: string | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'comments_blog_post_id_fkey';
						columns: ['blog_post_id'];
						isOneToOne: false;
						referencedRelation: 'blog_posts';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comments_listing_id_fkey';
						columns: ['listing_id'];
						isOneToOne: false;
						referencedRelation: 'listings';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comments_parent_comment_id_fkey';
						columns: ['parent_comment_id'];
						isOneToOne: false;
						referencedRelation: 'comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comments_sublisting_id_fkey';
						columns: ['sublisting_id'];
						isOneToOne: false;
						referencedRelation: 'sublistings';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comments_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			feedback: {
				Row: {
					created_at: string | null;
					description: string | null;
					email: string | null;
					feedback_type: string | null;
					id: string;
					is_handled: boolean | null;
					url: string | null;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					email?: string | null;
					feedback_type?: string | null;
					id?: string;
					is_handled?: boolean | null;
					url?: string | null;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					email?: string | null;
					feedback_type?: string | null;
					id?: string;
					is_handled?: boolean | null;
					url?: string | null;
				};
				Relationships: [];
			};
			listings: {
				Row: {
					average_rating: number | null;
					category_id: string | null;
					click_url: string;
					clicks: number | null;
					created_at: string | null;
					default_image_url: string | null;
					description: string;
					discount_code: string | null;
					discount_code_percentage: string | null;
					discount_code_text: string | null;
					embedding: string | null;
					excerpt: string | null;
					finder_id: string | null;
					fts: unknown | null;
					id: string;
					is_admin_published: boolean | null;
					is_promoted: boolean | null;
					is_user_published: boolean | null;
					likes: number | null;
					logo_image_url: string | null;
					owner_id: string | null;
					ratings_count: number | null;
					slug: string;
					title: string;
					updated_at: string | null;
					views: number | null;
				};
				Insert: {
					average_rating?: number | null;
					category_id?: string | null;
					click_url: string;
					clicks?: number | null;
					created_at?: string | null;
					default_image_url?: string | null;
					description: string;
					discount_code?: string | null;
					discount_code_percentage?: string | null;
					discount_code_text?: string | null;
					embedding?: string | null;
					excerpt?: string | null;
					finder_id?: string | null;
					fts?: unknown | null;
					id?: string;
					is_admin_published?: boolean | null;
					is_promoted?: boolean | null;
					is_user_published?: boolean | null;
					likes?: number | null;
					logo_image_url?: string | null;
					owner_id?: string | null;
					ratings_count?: number | null;
					slug: string;
					title: string;
					updated_at?: string | null;
					views?: number | null;
				};
				Update: {
					average_rating?: number | null;
					category_id?: string | null;
					click_url?: string;
					clicks?: number | null;
					created_at?: string | null;
					default_image_url?: string | null;
					description?: string;
					discount_code?: string | null;
					discount_code_percentage?: string | null;
					discount_code_text?: string | null;
					embedding?: string | null;
					excerpt?: string | null;
					finder_id?: string | null;
					fts?: unknown | null;
					id?: string;
					is_admin_published?: boolean | null;
					is_promoted?: boolean | null;
					is_user_published?: boolean | null;
					likes?: number | null;
					logo_image_url?: string | null;
					owner_id?: string | null;
					ratings_count?: number | null;
					slug?: string;
					title?: string;
					updated_at?: string | null;
					views?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'listings_category_id_fkey';
						columns: ['category_id'];
						isOneToOne: false;
						referencedRelation: 'categories';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'listings_finder_id_fkey';
						columns: ['finder_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'listings_owner_id_fkey';
						columns: ['owner_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			listings_tags: {
				Row: {
					listing_id: string;
					tag_id: string;
				};
				Insert: {
					listing_id: string;
					tag_id: string;
				};
				Update: {
					listing_id?: string;
					tag_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'listings_tags_listing_id_fkey';
						columns: ['listing_id'];
						isOneToOne: false;
						referencedRelation: 'listings';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'listings_tags_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'tags';
						referencedColumns: ['id'];
					}
				];
			};
			promotions: {
				Row: {
					category_id: string;
					created_at: string | null;
					end_date: string;
					id: string;
					is_admin_approved: boolean;
					is_paid: boolean | null;
					listing_id: string;
					price: number;
					profile_id: string | null;
					start_date: string;
					stripe_checkout_id: string | null;
					stripe_payment_intent: string | null;
					stripe_receipt_url: string | null;
					updated_at: string | null;
				};
				Insert: {
					category_id: string;
					created_at?: string | null;
					end_date: string;
					id?: string;
					is_admin_approved?: boolean;
					is_paid?: boolean | null;
					listing_id: string;
					price: number;
					profile_id?: string | null;
					start_date: string;
					stripe_checkout_id?: string | null;
					stripe_payment_intent?: string | null;
					stripe_receipt_url?: string | null;
					updated_at?: string | null;
				};
				Update: {
					category_id?: string;
					created_at?: string | null;
					end_date?: string;
					id?: string;
					is_admin_approved?: boolean;
					is_paid?: boolean | null;
					listing_id?: string;
					price?: number;
					profile_id?: string | null;
					start_date?: string;
					stripe_checkout_id?: string | null;
					stripe_payment_intent?: string | null;
					stripe_receipt_url?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'promotions_category_id_fkey';
						columns: ['category_id'];
						isOneToOne: false;
						referencedRelation: 'categories';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'promotions_listing_id_fkey';
						columns: ['listing_id'];
						isOneToOne: false;
						referencedRelation: 'listings';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'promotions_profile_id_fkey';
						columns: ['profile_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			subcategories: {
				Row: {
					color: string | null;
					created_at: string | null;
					description: string | null;
					emoji: string | null;
					headline: string | null;
					href: string | null;
					id: string;
					image_url_hero: string | null;
					image_url_small: string | null;
					name: string;
					slug: string;
					updated_at: string | null;
				};
				Insert: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name: string;
					slug: string;
					updated_at?: string | null;
				};
				Update: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name?: string;
					slug?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			subcategory_groups: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			subcategory_groups_subcategories_association: {
				Row: {
					subcategory_group_id: string;
					subcategory_id: string;
				};
				Insert: {
					subcategory_group_id: string;
					subcategory_id: string;
				};
				Update: {
					subcategory_group_id?: string;
					subcategory_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'subcategory_groups_subcategories_asso_subcategory_group_id_fkey';
						columns: ['subcategory_group_id'];
						isOneToOne: false;
						referencedRelation: 'subcategory_groups';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'subcategory_groups_subcategories_associatio_subcategory_id_fkey';
						columns: ['subcategory_id'];
						isOneToOne: false;
						referencedRelation: 'subcategories';
						referencedColumns: ['id'];
					}
				];
			};
			sublistings: {
				Row: {
					availability: boolean | null;
					average_rating: number | null;
					click_url: string;
					clicks: number | null;
					created_at: string | null;
					default_image_url: string | null;
					description: string;
					embedding: string | null;
					excerpt: string | null;
					finder_id: string;
					fts: unknown | null;
					id: string;
					is_admin_published: boolean | null;
					is_promoted: boolean | null;
					is_user_published: boolean | null;
					likes: number | null;
					listing_id: string;
					owner_id: string | null;
					price_promotional_in_cents: number | null;
					price_regular_in_cents: number | null;
					ratings_count: number | null;
					size: string | null;
					slug: string;
					subcategory_id: string | null;
					title: string;
					updated_at: string | null;
					views: number | null;
				};
				Insert: {
					availability?: boolean | null;
					average_rating?: number | null;
					click_url: string;
					clicks?: number | null;
					created_at?: string | null;
					default_image_url?: string | null;
					description: string;
					embedding?: string | null;
					excerpt?: string | null;
					finder_id: string;
					fts?: unknown | null;
					id?: string;
					is_admin_published?: boolean | null;
					is_promoted?: boolean | null;
					is_user_published?: boolean | null;
					likes?: number | null;
					listing_id: string;
					owner_id?: string | null;
					price_promotional_in_cents?: number | null;
					price_regular_in_cents?: number | null;
					ratings_count?: number | null;
					size?: string | null;
					slug: string;
					subcategory_id?: string | null;
					title: string;
					updated_at?: string | null;
					views?: number | null;
				};
				Update: {
					availability?: boolean | null;
					average_rating?: number | null;
					click_url?: string;
					clicks?: number | null;
					created_at?: string | null;
					default_image_url?: string | null;
					description?: string;
					embedding?: string | null;
					excerpt?: string | null;
					finder_id?: string;
					fts?: unknown | null;
					id?: string;
					is_admin_published?: boolean | null;
					is_promoted?: boolean | null;
					is_user_published?: boolean | null;
					likes?: number | null;
					listing_id?: string;
					owner_id?: string | null;
					price_promotional_in_cents?: number | null;
					price_regular_in_cents?: number | null;
					ratings_count?: number | null;
					size?: string | null;
					slug?: string;
					subcategory_id?: string | null;
					title?: string;
					updated_at?: string | null;
					views?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'sublistings_finder_id_fkey';
						columns: ['finder_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'sublistings_listing_id_fkey';
						columns: ['listing_id'];
						isOneToOne: false;
						referencedRelation: 'listings';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'sublistings_owner_id_fkey';
						columns: ['owner_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'sublistings_subcategory_id_fkey';
						columns: ['subcategory_id'];
						isOneToOne: false;
						referencedRelation: 'subcategories';
						referencedColumns: ['id'];
					}
				];
			};
			sublistings_subtags: {
				Row: {
					sublisting_id: string;
					subtag_id: string;
				};
				Insert: {
					sublisting_id: string;
					subtag_id: string;
				};
				Update: {
					sublisting_id?: string;
					subtag_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'sublistings_subtags_listing_id_fkey';
						columns: ['sublisting_id'];
						isOneToOne: false;
						referencedRelation: 'sublistings';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'sublistings_subtags_subtag_id_fkey';
						columns: ['subtag_id'];
						isOneToOne: false;
						referencedRelation: 'subtags';
						referencedColumns: ['id'];
					}
				];
			};
			subtag_groups: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			subtag_groups_subtags_association: {
				Row: {
					subtag_group_id: string;
					subtag_id: string;
				};
				Insert: {
					subtag_group_id: string;
					subtag_id: string;
				};
				Update: {
					subtag_group_id?: string;
					subtag_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'subtag_groups_subtags_association_subtag_group_id_fkey';
						columns: ['subtag_group_id'];
						isOneToOne: false;
						referencedRelation: 'subtag_groups';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'subtag_groups_subtags_association_subtag_id_fkey';
						columns: ['subtag_id'];
						isOneToOne: false;
						referencedRelation: 'subtags';
						referencedColumns: ['id'];
					}
				];
			};
			subtags: {
				Row: {
					color: string | null;
					created_at: string | null;
					description: string | null;
					emoji: string | null;
					headline: string | null;
					href: string | null;
					id: string;
					image_url_hero: string | null;
					image_url_small: string | null;
					name: string;
					slug: string;
					updated_at: string | null;
				};
				Insert: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name: string;
					slug: string;
					updated_at?: string | null;
				};
				Update: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name?: string;
					slug?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			tag_groups: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			tag_groups_tags_association: {
				Row: {
					tag_group_id: string;
					tag_id: string;
				};
				Insert: {
					tag_group_id: string;
					tag_id: string;
				};
				Update: {
					tag_group_id?: string;
					tag_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'tag_groups_tags_association_tag_group_id_fkey';
						columns: ['tag_group_id'];
						isOneToOne: false;
						referencedRelation: 'tag_groups';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'tag_groups_tags_association_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'tags';
						referencedColumns: ['id'];
					}
				];
			};
			tags: {
				Row: {
					color: string | null;
					created_at: string | null;
					description: string | null;
					emoji: string | null;
					headline: string | null;
					href: string | null;
					id: string;
					image_url_hero: string | null;
					image_url_small: string | null;
					name: string;
					slug: string;
					updated_at: string | null;
				};
				Insert: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name: string;
					slug: string;
					updated_at?: string | null;
				};
				Update: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					emoji?: string | null;
					headline?: string | null;
					href?: string | null;
					id?: string;
					image_url_hero?: string | null;
					image_url_small?: string | null;
					name?: string;
					slug?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			topics: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
					slug: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					name: string;
					slug: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
					slug?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			users: {
				Row: {
					auth_id: string | null;
					avatar_url: string | null;
					created_at: string;
					deleted_at: string | null;
					email: string | null;
					full_name: string | null;
					id: string;
					is_active: boolean;
					is_super_admin: boolean | null;
					role: string | null;
					tag_line: string | null;
					updated_at: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					auth_id?: string | null;
					avatar_url?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string | null;
					full_name?: string | null;
					id: string;
					is_active?: boolean;
					is_super_admin?: boolean | null;
					role?: string | null;
					tag_line?: string | null;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					auth_id?: string | null;
					avatar_url?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string | null;
					full_name?: string | null;
					id?: string;
					is_active?: boolean;
					is_super_admin?: boolean | null;
					role?: string | null;
					tag_line?: string | null;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			binary_quantize:
				| {
						Args: {
							'': string;
						};
						Returns: unknown;
				  }
				| {
						Args: {
							'': unknown;
						};
						Returns: unknown;
				  };
			get_active_categories: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					category_groups: Json;
				}[];
			};
			get_active_subcategories: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					subcategory_groups: Json;
				}[];
			};
			get_active_subtags: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					subtag_groups: Json;
				}[];
			};
			get_active_tags: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					tag_groups: Json;
				}[];
			};
			get_active_topics: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
				}[];
			};
			get_categories_with_listing_count: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					headline: string;
					listing_count: number;
				}[];
			};
			get_full_active_categories: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					headline: string;
					description: string;
					image_url_hero: string;
					image_url_small: string;
					href: string;
					color: string;
					emoji: string;
					category_groups: Json;
				}[];
			};
			get_full_active_subcategories: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					headline: string;
					description: string;
					image_url_hero: string;
					image_url_small: string;
					href: string;
					color: string;
					emoji: string;
					subcategory_groups: Json;
				}[];
			};
			get_full_active_subtags: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					headline: string;
					description: string;
					image_url_hero: string;
					image_url_small: string;
					href: string;
					color: string;
					emoji: string;
					subtag_groups: Json;
				}[];
			};
			get_full_active_tags: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					headline: string;
					description: string;
					image_url_hero: string;
					image_url_small: string;
					href: string;
					color: string;
					emoji: string;
					tag_groups: Json;
				}[];
			};
			get_listing_statistics: {
				Args: {
					logged_user_id?: string;
				};
				Returns: Json;
			};
			get_subcategories_with_sublisting_count: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					name: string;
					slug: string;
					headline: string;
					listing_count: number;
				}[];
			};
			get_sublisting_statistics: {
				Args: {
					logged_user_id?: string;
					sublisting_id?: string;
				};
				Returns: Json;
			};
			get_user_usernames: {
				Args: Record<PropertyKey, never>;
				Returns: {
					username: string;
				}[];
			};
			halfvec_avg: {
				Args: {
					'': number[];
				};
				Returns: unknown;
			};
			halfvec_out: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			halfvec_send: {
				Args: {
					'': unknown;
				};
				Returns: string;
			};
			halfvec_typmod_in: {
				Args: {
					'': unknown[];
				};
				Returns: number;
			};
			hnsw_bit_support: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			hnsw_halfvec_support: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			hnsw_sparsevec_support: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			hnswhandler: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			increment_field: {
				Args: {
					listing_id: string;
					field_name: string;
				};
				Returns: undefined;
			};
			increment_field_sublisting: {
				Args: {
					sublisting_id: string;
					field_name: string;
				};
				Returns: undefined;
			};
			ivfflat_bit_support: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			ivfflat_halfvec_support: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			ivfflathandler: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			l2_norm:
				| {
						Args: {
							'': unknown;
						};
						Returns: number;
				  }
				| {
						Args: {
							'': unknown;
						};
						Returns: number;
				  };
			l2_normalize:
				| {
						Args: {
							'': string;
						};
						Returns: string;
				  }
				| {
						Args: {
							'': unknown;
						};
						Returns: unknown;
				  }
				| {
						Args: {
							'': unknown;
						};
						Returns: unknown;
				  };
			match_listings: {
				Args: {
					embedding: string;
					match_threshold: number;
					match_count: number;
				};
				Returns: {
					id: string;
					title: string;
					similarity: number;
				}[];
			};
			match_sublistings: {
				Args: {
					embedding: string;
					match_threshold: number;
					match_count: number;
				};
				Returns: {
					id: string;
					title: string;
					similarity: number;
				}[];
			};
			sparsevec_out: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
			sparsevec_send: {
				Args: {
					'': unknown;
				};
				Returns: string;
			};
			sparsevec_typmod_in: {
				Args: {
					'': unknown[];
				};
				Returns: number;
			};
			update_rating: {
				Args: {
					listing_id: string;
					new_rating: number;
				};
				Returns: undefined;
			};
			update_rating_sublisting: {
				Args: {
					sublisting_id: string;
					new_rating: number;
				};
				Returns: undefined;
			};
			vector_avg: {
				Args: {
					'': number[];
				};
				Returns: string;
			};
			vector_dims:
				| {
						Args: {
							'': string;
						};
						Returns: number;
				  }
				| {
						Args: {
							'': unknown;
						};
						Returns: number;
				  };
			vector_norm: {
				Args: {
					'': string;
				};
				Returns: number;
			};
			vector_out: {
				Args: {
					'': string;
				};
				Returns: unknown;
			};
			vector_send: {
				Args: {
					'': string;
				};
				Returns: string;
			};
			vector_typmod_in: {
				Args: {
					'': unknown[];
				};
				Returns: number;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
			PublicSchema['Views'])
	? (PublicSchema['Tables'] &
			PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
	? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
	: never;
