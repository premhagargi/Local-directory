'use client';
// Import Types
import { ListingType, CategoryType } from '@/supabase-special-types';
import { DateBefore, DateRange } from 'react-day-picker';
// Import External Packages
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import {
	addDays,
	differenceInCalendarDays,
	endOfDay,
	startOfDay,
} from 'date-fns';
import { useEffect, useState } from 'react';
// Import Components
import StripeCheckout from './StripeCheckout';
import { Label } from '@/ui/Label';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/ui/Select';
import { Popover, PopoverTrigger, PopoverContent } from '@/ui/Popover';
import { Button } from '@/ui/Button';
import { Calendar } from '@/ui/Calendar';
// Import Functions & Actions & Hooks & State
import createStripeCheckoutSession from '@/actions/promotions/createStripeCheckoutSession';
import { toast } from '@/lib/useToaster';
import { formatDateToTimezone } from '@/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, PROMOTIONS_DATA } from '@/constants';
// Import Assets & Icons

export default function FeeCalculator({
	listings,
	categories,
	disabledDates,
	paymentObject,
}: {
	listings: ListingType[];
	categories: CategoryType[];
	disabledDates: {
		start_date: string;
		end_date: string;
		category_id: string | null;
	}[];
	paymentObject:
		| {
				error: string;
				success: boolean;
		  }
		| undefined;
}) {
	const [selectedListingId, setSelectedListingId] = useState<string>();
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
	const [selectedDateRange, setSelectedDateRange] = useState<
		DateRange | undefined
	>();
	const [promotionFee, setPromotionFee] = useState(0);
	const [days, setDays] = useState(0);
	const [error, setError] = useState<string | null>();
	const [stripeClientSecret, setStripeClientSecret] = useState<string | null>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (paymentObject && paymentObject.success) {
			toast({
				title: 'Success',
				description: 'Payment successful',
			});
		}
	}, [paymentObject]);

	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const disabledDatesForCategory: (DateRange | DateBefore)[] = disabledDates
		.filter((date) => date.category_id === selectedCategoryId)
		.map((dateRange) => ({
			from: toZonedTime(new Date(dateRange.start_date), userTimeZone),
			to: toZonedTime(new Date(dateRange.end_date), userTimeZone),
		}));

	disabledDatesForCategory.push({
		before: toZonedTime(addDays(new Date(), 1), userTimeZone),
	});

	const handleListingChange = (listingId: string) => {
		const categoryId = listings.find(
			(listing) => listing.id === listingId
		)?.category_id;
		if (!categoryId) return;
		setSelectedCategoryId(categoryId);
		setSelectedListingId(listingId);
		setSelectedDateRange(undefined);
		setPromotionFee(0);
	};

	const calculatePromotionFee = (dateRange: DateRange | undefined) => {
		if (!dateRange || !dateRange.from || !dateRange.to) {
			setPromotionFee(0);
		} else {
			const days = differenceInCalendarDays(dateRange.to, dateRange.from) + 1;
			const fee =
				days *
				PROMOTIONS_DATA.FIXED_FEE_PER_DAY *
				(days >= 30 ? 1 - PROMOTIONS_DATA.THIRTY_DAY_DISCOUNT : 1);
			setPromotionFee(fee);
			setDays(days);
		}
	};

	const handleDateRangeChange = (dateRange: DateRange | undefined) => {
		if (dateRange) {
			const utcStartDate = dateRange.from
				? fromZonedTime(startOfDay(dateRange.from), userTimeZone)
				: undefined;
			const utcEndDate = dateRange.to
				? fromZonedTime(endOfDay(dateRange.to), userTimeZone)
				: undefined;

			const correctedDateRange: DateRange = {
				from: utcStartDate,
				to: utcEndDate,
			};

			setSelectedDateRange(correctedDateRange);
			calculatePromotionFee(dateRange);
		} else {
			setSelectedDateRange(undefined);
			setPromotionFee(0);
		}
	};

	const handleSubmit = async () => {
		if (!selectedDateRange?.from || !selectedDateRange?.to) {
			setError('Invalid date range');
			return;
		} else if (!selectedListingId || !selectedCategoryId || promotionFee < 1) {
			setError('Missing data');
			return;
		} else {
			setIsSubmitting(true);
			const {
				error: stripeError,
				success: checkoutSuccess,
				data: generatedClientSecret,
			} = await createStripeCheckoutSession({
				start_date: selectedDateRange.from,
				end_date: selectedDateRange.to,
				price: promotionFee,
				listingId: selectedListingId,
				categoryId: selectedCategoryId,
			});
			// check if stripeclientsecret is key of generatedClientSecret - most likely this will error when Stripe is not configured. So we let the user know to contact us.
			if (!('stripeClientSecret' in generatedClientSecret)) {
				setError(
					`Please contact us (${
						COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL
					}) and let us know that you want to promote your listing and include the following data: ${JSON.stringify(
						{
							start_date: selectedDateRange.from,
							end_date: selectedDateRange.to,
							price: promotionFee,
							listingId: selectedListingId,
							categoryId: selectedCategoryId,
						}
					)}. This way we can setup you up right away.`
				);
				return;
			}
			if (stripeError) {
				setError(JSON.stringify(stripeError));
				return;
			}
			if (checkoutSuccess) {
				setStripeClientSecret(generatedClientSecret.stripeClientSecret);
				setIsSubmitting(false);
			}
		}
	};

	const abortFunction = () => {
		setStripeClientSecret(null);
		setIsSubmitting(false);
	};

	return (
		<div className="grid gap-4">
			{stripeClientSecret ? (
				<StripeCheckout
					stripeClientSecret={stripeClientSecret}
					abortFunction={abortFunction}
				/>
			) : (
				<>
					<div>
						<Label htmlFor="listing">Select Listing</Label>
						<Select
							value={selectedListingId}
							onValueChange={handleListingChange}
						>
							<SelectTrigger className="w-full  bg-white">
								<SelectValue placeholder="Select a listing" />
							</SelectTrigger>
							<SelectContent>
								{listings.map((listing) => (
									<SelectItem key={listing.id} value={listing.id}>
										{listing.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="category">Selected Category</Label>
						<Select value={selectedCategoryId} disabled>
							<SelectTrigger className="w-full bg-white">
								<SelectValue placeholder="Select a listing" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category.id} value={category.id}>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="date-range">Select Date Range</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start"
									disabled={!selectedListingId}
								>
									{selectedDateRange &&
									selectedDateRange.from &&
									selectedDateRange.to
										? `${formatDateToTimezone(
												selectedDateRange.from,
												userTimeZone
										  )} - ${formatDateToTimezone(
												selectedDateRange.to,
												userTimeZone
										  )}`
										: 'Select date range'}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-0 max-w-[276px]">
								<Calendar
									mode="range"
									selected={selectedDateRange}
									onSelect={handleDateRangeChange}
									disabled={disabledDatesForCategory}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div>
						<div className="flex items-center justify-between">
							<span className="font-semibold">
								Promotion Fee:{' '}
								{promotionFee > 0 && (
									<span className="text-xs italic font-normal">
										${PROMOTIONS_DATA.FIXED_FEE_PER_DAY} * {days} days{' '}
										{days >= 30 && '(+10% off)'}
									</span>
								)}
							</span>
							<span className="text-2xl font-bold">
								${promotionFee.toFixed(2)}{' '}
								<span className="text-xs font-thin">excl. tax</span>
							</span>
						</div>
						<Button
							type="button"
							size="lg"
							className="w-full mt-4"
							disabled={
								promotionFee < 1 ||
								!selectedListingId ||
								isSubmitting ||
								!selectedDateRange
							}
							onClick={() => {
								handleSubmit();
							}}
						>
							{isSubmitting ? 'Loading Payment Provider' : 'Promote Now'}
						</Button>
					</div>
				</>
			)}
			<div>{error && <div className="text-red-500">{error}</div>}</div>
		</div>
	);
}
