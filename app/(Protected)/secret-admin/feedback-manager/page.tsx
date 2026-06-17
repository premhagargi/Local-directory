// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import FeedbackTable from './_components/FeedbackTable';
import { SectionOuterContainer, SectionTitle } from '@/ui/Section';
import { CardHeader, CardDescription, CardContent, Card } from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import getFeedback_ADMIN from '@/actions/feedback/getFeedback_ADMIN';
import serverAuth from '@/actions/auth/serverAuth';
// Import Data
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Admin Area: Feedback Manager`,
};

export default async function FeedbackManagerPage() {
	const { error } = await serverAuth({ mustBeAdmin: true });

	if (error) {
		return error;
	}

	const feedbackObject = await getFeedback_ADMIN();

	if (!feedbackObject.success) {
		return (
			<div>
				There was an error fetching the feedback. Try reloading the page.
			</div>
		);
	}

	return (
		<SectionOuterContainer className="grid flex-1 items-start gap-4 py-6">
			<Card>
				<CardHeader>
					<SectionTitle>Feedback Manager</SectionTitle>
					<CardDescription>
						Here you will find all feedback submitted by users. It can either be
						(1) a feedback message through the feedback box on each site, or (2)
						a &apos;Report This Listing&apos; feedback, or (3) &apos;Propose a
						listing&apos; feedback. You can &apos;handle&apos; feedback here,
						which is only a way for you to know that you have taken care of this
						report.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<FeedbackTable feedback={feedbackObject.data} />
				</CardContent>
			</Card>
		</SectionOuterContainer>
	);
}
