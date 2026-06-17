// Import Types
// Import External Packages
import { NextResponse } from 'next/server';
// Import Components
// Import Functions & Actions & Hooks & State
import createSupabaseServiceClient from '@/lib/createSupabaseServiceClient';
import insertActivity from '@/actions/activites/insertActivity';
import {
	InternalServerError,
	handleServerError,
	handleServerSuccess,
} from '@/lib/handlingServerResponses';
// Import Data
// Import Assets & Icons

export const dynamic = 'force-dynamic';

// Secure Password Like Secret key
const secretKey = process.env.API_SECRET_KEY;

async function handleTodaysPromotions() {
	const todayDateString = new Date().toISOString().split('T')[0];
	const yesterdayDateString = new Date(Date.now() - 86400000)
		.toISOString()
		.split('T')[0];

	try {
		const supabase = createSupabaseServiceClient();
		const { data, error } = await supabase
			.from('promotions')
			.select('listing_id, start_date, end_date')
			.match({ is_admin_approved: true })
			.neq('id', crypto.randomUUID());

		if (error) {
			console.error('Error retrieving promotions:', error);
			throw new InternalServerError('Error retrieving promotions.');
		}

		const newPromotions = data
			.filter((promotion) => {
				return promotion.start_date === todayDateString;
			})
			.map((promotion) => promotion.listing_id);

		const endingPromotions = data
			.filter((promotion) => {
				return promotion.end_date === yesterdayDateString;
			})
			.map((promotion) => promotion.listing_id);

		if (newPromotions.length > 0) {
			const { data: activatedListingTitles, error: activatedListingError } =
				await supabase
					.from('listings')
					.update({ is_promoted: true })
					.in('id', newPromotions)
					.select('title');

			if (activatedListingError) {
				console.error('Error activating is_promoted state of listings.', error);
				throw new InternalServerError(
					'Error activating the database with new promotions.'
				);
			}

			if (activatedListingTitles && activatedListingTitles.length > 0) {
				await insertActivity(
					'start_promotion',
					activatedListingTitles?.map((listing) => listing.title).join(', '),
					true
				);
			} else {
				throw new InternalServerError(
					'There were promotions but the activity was not logged.'
				);
			}
		}

		if (endingPromotions.length > 0) {
			const { data: deactivatedListingTitles, error: deactivatedListingError } =
				await supabase
					.from('listings')
					.update({ is_promoted: false })
					.in('id', endingPromotions)
					.select('title');

			if (deactivatedListingError) {
				console.error(
					'Error deactivating is_promoted state of listings.',
					error
				);
				throw new InternalServerError(
					'Error deactivating the database with new promotions.'
				);
			}

			if (deactivatedListingTitles && deactivatedListingTitles.length > 0) {
				await insertActivity(
					'end_promotion',
					deactivatedListingTitles?.map((listing) => listing.title).join(', '),
					true
				);
			} else {
				throw new InternalServerError(
					'There were deomotions but the activity was not logged.'
				);
			}
		}

		return handleServerSuccess();
	} catch (error) {
		return handleServerError(error, {});
	}
}

/**
 * Handles the GET request to generate DESCRIPTION & EXCERPRT FOR A TAG / CATEGORY.
 * @param req - The Request object representing the incoming request.
 * @returns A JSON response indicating the description and excerpt of the company.
 */
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const sharedKey = searchParams.get('secretKey');

	if (sharedKey !== secretKey) {
		return NextResponse.json(
			{ error: true, message: 'Wrong key.' },
			{ status: 400 }
		);
	}
	try {
		const success = await handleTodaysPromotions();

		if (success) {
			return NextResponse.json(
				{ error: false, message: 'Promotions handled successfully.' },
				{
					status: 200,
				}
			);
		}

		return NextResponse.json(
			{ error: true, message: 'Promotions NOT handled successfully!' },
			{
				status: 500,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: true, message: 'Error in Try Catch Promotion Handler.' },
			{
				status: 400,
			}
		);
	}
}
