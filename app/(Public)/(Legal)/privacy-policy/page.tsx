// Import Types
import { Metadata } from 'next';
// Import External Packages
// Import Components
import {
	SectionOuterContainer,
	SectionTitle,
	SectionDescription,
	SubSectionOuterContainer,
	SubSectionInnerContainer,
	SectionHeaderContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
import Link from 'next/link';
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Privacy Policy`,
	description: `Privacy Policy by ${COMPANY_BASIC_INFORMATION.NAME}.`,
};

export default function PrivacyPolicyPage() {
	return (
		<SectionOuterContainer id="Privacy Policy">
			<SectionHeaderContainer>
				<SectionTitle>Privacy Policy</SectionTitle>
				<SectionDescription>Last updated May 28, 2024</SectionDescription>
			</SectionHeaderContainer>
			<SubSectionOuterContainer className="max-w-3xl">
				<SubSectionInnerContainer className="items-start prose text-justify dark:prose-invert">
					<p>
						Welcome to {COMPANY_BASIC_INFORMATION.NAME}. We are committed to
						protecting your privacy. This Privacy Policy explains how we
						collect, use, and share information about you when you use our
						website. By using our website, you agree to the collection and use
						of information in accordance with this policy.
					</p>

					<h2>1. Information Collection and Use</h2>
					<p>
						We collect information that you provide directly to us when you make
						listing proposals, create an account, or interact with our services.
						This includes:
					</p>
					<ul>
						<li>
							Account Information: To create an account, you will provide
							credentials via our third-party authentication provider,
							Clerk.com. We do not store your login credentials on our servers.
						</li>
						<li>
							Listing Proposals: When you propose a directory listing, we
							collect the information you provide in the proposal, which may
							include personal or business contact information.
						</li>
					</ul>

					<h2>2. Data Controller</h2>
					<p>
						{COMPANY_BASIC_INFORMATION.NAME} is the controller of your personal
						data provided to, or collected by or for, our Service.
					</p>

					<h2>3. Data Processor</h2>
					<p>
						Supabase.com acts as our data processor for authentication services.
						They manage your login information and authentication, not
						{COMPANY_BASIC_INFORMATION.NAME}.
					</p>
					<p>
						Stripe.com acts as our data processor for payment services. They
						manage your payment details, not
						{COMPANY_BASIC_INFORMATION.NAME}.
					</p>

					<h2>4. Use of Data</h2>
					<p>
						We use the information we collect to: Operate, maintain, and improve
						our services. Process and complete transactions, and send related
						information including transaction confirmations and invoices.
					</p>

					<h2>5. Data Retention</h2>
					<p>
						We retain your personal information for as long as your account is
						active or as needed to provide you services. You can delete your
						account by visiting the /account section of our website.
					</p>
					<h2>6. Your Data Protection Rights Under GDPR</h2>
					<p>
						Under GDPR, you have the right to access, rectify, or erase your
						personal data, restrict processing, object to processing, and, if
						applicable, the right to data portability. You may exercise these
						rights by accessing your account settings or contacting us directly.
					</p>
					<h2>7. Changes to This Privacy Policy</h2>
					<p>
						We may update our Privacy Policy from time to time. We will notify
						you of any changes by posting the new Privacy Policy on this page.
						You are advised to review this Privacy Policy periodically for any
						changes.
					</p>
					<h2>8. Cookies</h2>
					<p>
						Please read our{' '}
						<Link href="cookie-policy" className="underline">
							Cookie Policy
						</Link>
						.
					</p>
					<h2>8. Contact Us</h2>
					<p>
						If you have any questions about this Privacy Policy, please contact
						us at {COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}.
					</p>
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>
		</SectionOuterContainer>
	);
}
