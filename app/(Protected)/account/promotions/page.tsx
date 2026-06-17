// Import Types
// Import External Packages
// Import Components
import FeeCalculator from './_components/FeeCalculator';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { buttonVariants } from '@/ui/Button';
import Confetti from '@/ui/Confetti';
import { Card, CardContent, CardDescription, CardHeader } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import retrieveStripeCheckoutSession from '@/actions/promotions/retrieveStripeCheckoutSession';
import getPartialCategories from '@/actions/categories/getPartialCategories';
import insertPromotion from '@/actions/promotions/insertPromotion';
import insertActivity from '@/actions/activites/insertActivity';
import getTakenPromotionDates from '@/actions/promotions/getTakenPromotionDates';
import getPromotionsByUserId from '@/actions/promotions/getPromotionsByUserId';
import getListingsByUserId from '@/actions/listings/getListingsByUserId';
import serverAuth from '@/actions/auth/serverAuth';
import { cn } from '@/lib/utils';
// Import Data
import { COMPANY_BASIC_INFORMATION, GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons
import {
	ExternalLink,
	MegaphoneIcon,
	RocketIcon,
	TargetIcon,
	WalletIcon,
} from 'lucide-react';

export default async function PromotionPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const { user, error } = await serverAuth({
		mustBeSignedIn: true,
		checkUser: true,
	});

	if (!user || error) {
		return error;
	}

	const { data: listingData } = await getListingsByUserId(user.id);
	const { data: categoryData } = await getPartialCategories('active');
	const { data: promotionData } = await getPromotionsByUserId(user.id);
	const { data: disabledDates } = await getTakenPromotionDates();

	let paymentError = false;

	const paymentSuccess =
		searchParams && searchParams.success ? Boolean(searchParams.success) : null;
	const sessionId = searchParams && searchParams.session_id;

	const paymentObject = sessionId
		? await retrieveStripeCheckoutSession(sessionId)
		: undefined;

	if (paymentSuccess && paymentObject?.success) {
		const formData = {
			listingId: paymentObject.data.metadata.listingId,
			categoryId: paymentObject.data.metadata.categoryId,
			start_date: new Date(paymentObject.data.metadata.start_date * 1000),
			end_date: new Date(paymentObject.data.metadata.end_date * 1000),
			price: paymentObject.data.amount_subtotal,
			stripe_checkout_id: paymentObject.data.id,
			stripe_payment_intent: paymentObject.data.payment_intent,
		};
		const { errors, success } = await insertPromotion(formData);
		if (!success && errors) {
			console.error(errors);
			paymentError = true;
		}
		const promotedListing = listingData.find(
			(listing) => listing.id === formData.listingId
		);
		await insertActivity(
			'new_promotion',
			`Promoted Listing: ${promotedListing?.title || formData.listingId}`
		);
	}

	return GENERAL_SETTINGS.USE_PROMOTE ? (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 px-6 sm:px-0 relative">
			<Confetti
				isActive={paymentObject !== undefined && paymentObject.success}
				duration={5000}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card className="p-6">
					<CardHeader>
						<SectionTitle className="mx-0 max-w-none text-left">
							Promote Your Listing
						</SectionTitle>
						<CardDescription>
							Boost your visibility and attract more customers with a paid
							promotion on our directory.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{paymentError && (
							<p className="text-red-500">
								Payment Error: Please contact{' '}
								{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL} for support on your
								payment.
							</p>
						)}
						{process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
							<FeeCalculator
								listings={listingData}
								categories={categoryData}
								disabledDates={disabledDates}
								paymentObject={paymentObject}
							/>
						) : (
							<p>
								We currently have self-service promotions deactivated. Please
								write {COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL} and let us know
								which listing you want to promote.
							</p>
						)}
					</CardContent>
				</Card>

				<div className="p-6">
					<h2 className="text-2xl font-bold py-4">Previous Promotions</h2>

					<div className="space-y-4">
						{!promotionData.length && (
							<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-96">
								<div className="flex flex-col items-center gap-1 text-center">
									<h3 className="text-2xl font-bold tracking-tight">
										You have no previous promotions.
									</h3>
									<p className="text-sm text-muted-foreground">
										We will display your promotions here, once you add them.
									</p>
								</div>
							</div>
						)}
						{promotionData.map((promotion) => (
							<div
								key={promotion.id}
								className="border rounded-lg p-4 flex items-center justify-between"
							>
								<div>
									<div className="font-semibold">{promotion.listing.title}</div>
									<div className="text-muted-foreground">
										{(categoryData &&
											categoryData.find(
												(c) => c.id === promotion.listing.category_id
											)?.name) ||
											'Unknown Category'}
									</div>
									<div className="text-muted-foreground">
										{`${new Date(promotion.start_date)
											.toISOString()
											.slice(0, 10)} - ${new Date(promotion.end_date)
											.toISOString()
											.slice(0, 10)}`}
									</div>
								</div>
								<div>
									{promotion.stripe_receipt_url ? (
										<a
											href={promotion.stripe_receipt_url}
											target="_blank"
											className={cn(
												buttonVariants({ variant: 'outline' }),
												'gap-x-2'
											)}
										>
											See Receipt
											<ExternalLink className="w-4 h-4 mr-2" />
										</a>
									) : (
										<p className="text-xs italic">
											Your receipt is being created.
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="mt-12 space-y-6">
				<h2 className="text-2xl font-bold">Why Promote Your Listing?</h2>
				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-white dark:bg-background-secondary rounded-lg p-6 space-y-4">
						<MegaphoneIcon className="w-8 h-8 text-primary" />
						<h3 className="text-xl font-semibold">Increased Visibility</h3>
						<p className="text-muted-foreground">
							Your listing will be prominently displayed, ensuring more
							potential customers discover your services.
						</p>
					</div>
					<div className="bg-white dark:bg-background-secondary rounded-lg p-6 space-y-4">
						<TargetIcon className="w-8 h-8 text-primary" />
						<h3 className="text-xl font-semibold">Targeted Audience</h3>
						<p className="text-muted-foreground">
							Reach the right customers who are actively searching for backend
							services in your category.
						</p>
					</div>
					<div className="bg-white dark:bg-background-secondary rounded-lg p-6 space-y-4">
						<RocketIcon className="w-8 h-8 text-primary" />
						<h3 className="text-xl font-semibold">Boost Your Leads</h3>
						<p className="text-muted-foreground">
							Increase your chances of converting more leads and growing your
							business with a paid promotion.
						</p>
					</div>
					<div className="bg-white dark:bg-background-secondary rounded-lg p-6 space-y-4">
						<WalletIcon className="w-8 h-8 text-primary" />
						<h3 className="text-xl font-semibold">Cost-Effective</h3>
						<p className="text-muted-foreground">
							Our promotion fees are affordable and can provide a significant
							return on your investment.
						</p>
					</div>
				</div>
			</div>
		</SectionOuterContainer>
	) : (
		<>We currently do not allow promotions.</>
	);
}
