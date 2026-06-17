// Import Types
// Import External Packages
import { z } from 'zod';
// Import Components
// Import Functions & Actions & Hooks & State
import { QueryData } from '@supabase/supabase-js';
import { leadQuery } from '../db/queries';
// Import Data
// Import Assets & Icons

export type FullLeadType = QueryData<typeof leadQuery>[0];

export const LeadFormUpdateSchema = z.object({
	id: z.string().min(2, { message: 'ID must be at least 2 characters.' }),
	status: z
		.string()
		.min(2, { message: 'Status must be at least 2 characters.' }),
	note: z.string().optional(),
});

export const LeadFormInsertSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	listingId: z.string().optional(),
	sublistingId: z.string().optional(),
	ownerId: z.string().optional(),
	message: z.string().optional(),
});

export type LeadFormUpdateDataType = z.infer<typeof LeadFormUpdateSchema>;
export type LeadFormInsertDataType = z.infer<typeof LeadFormInsertSchema>;
