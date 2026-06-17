// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import PromotionTable from './_components/PromotionTable';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getPromotions_ALL_ADMIN from '@/actions/promotions/getPromotions_ALL_ADMIN';
import serverAuth from '@/actions/auth/serverAuth';
import Link from 'next/link';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Admin Area: Promotion Manager`,
};

export default async function PromotionManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const promotionData = await getPromotions_ALL_ADMIN();

	if (!promotionData.success) {
		return <div>There was an error fetching the promotions.</div>;
	}

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<Card>
				<CardHeader>
					<SectionTitle>Promotions Manager</SectionTitle>
					<CardDescription>
						These listings should have been paid for by the user! As this is a
						self-service feature, and users will only be able to promote their
						own listings, you should only need to manage promotions here if you
						need to troubleshoot. You can manage the listings in the{' '}
						<Link
							href="/secret-admin/listing-manager"
							className="underline cursor-pointer"
						>
							Listing Manager
						</Link>
						.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<PromotionTable promotions={promotionData.data} />
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
