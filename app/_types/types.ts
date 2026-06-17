import { ListingType, SublistingType } from './supabase-queries-types';

export type LinkListItem = {
	href: string;
	label: string;
};

export type ValueLabelPair = {
	value: string;
	label: string;
};

export type SocialFollowLinkObject = {
	CHANNEL_NAME: string;
	CHANNEL_HREF: string;
	USERNAME: string;
	Icon: React.ElementType;
};

export type SocialShareLinkObject = {
	channelName: string;
	channelHref: string;
	shareTextInFrontOfURL: string;
	Icon: React.ElementType;
};

export type BlogPostMeta = {
	title: string;
	slug: string;
	description: string;
	images: string;
	createDate: Date;
	keyword: string[];
	updateDate?: Date | undefined;
	nextLink?: { name: string; href: string } | undefined;
	previousLink?: { name: string; href: string } | undefined;
	openGraph?: {
		url: string;
		images: string;
		title: string;
		description: string;
		type: string;
	};
	twitter?: {
		card: string;
		creator: string;
		images: string;
	};
};

export type SortDirectionObject = {
	label: string;
	value: string;
	sortKey: keyof ListingType;
	sortDir: 'asc' | 'desc';
};

export type SublistingSortDirectionObject = {
	label: string;
	value: string;
	sortKey: keyof SublistingType;
	sortDir: 'asc' | 'desc';
};
