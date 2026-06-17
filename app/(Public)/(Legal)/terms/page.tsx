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
// Import Assets & Icons

export const metadata: Metadata = {
	title: `Terms and Conditions`,
	description: `Terms and Conditions by ${COMPANY_BASIC_INFORMATION.NAME}.`,
};

export default function TermsPage() {
	return (
		<SectionOuterContainer id="ToS">
			<SectionHeaderContainer>
				<SectionTitle>
					Terms and Conditions of Use for {COMPANY_BASIC_INFORMATION.NAME}
				</SectionTitle>

				<SectionDescription>Last updated June 21, 2024</SectionDescription>
			</SectionHeaderContainer>
			<SubSectionOuterContainer className="max-w-3xl">
				<SubSectionInnerContainer className="items-start prose text-justify dark:prose-invert">
					<p>
						Welcome to {COMPANY_BASIC_INFORMATION.NAME}. By accessing our
						website and using our services, you agree to be bound by the
						following terms and conditions. If you do not agree with any part of
						these terms, you should not use this website.
					</p>

					<h2>1. Use of the Website:</h2>
					<p>
						{COMPANY_BASIC_INFORMATION.NAME} provides a collection of online
						resources which include directory listings (collectively, the
						&apos;Services&apos;). The Services, including any updates,
						enhancements, new features, and/or the addition of any new web
						properties, are subject to these Terms and Conditions.
					</p>

					<h2>2. Privacy Policy:</h2>
					<p>
						Your privacy is very important to us. We designed our Privacy Policy
						to make important disclosures about how you can use
						{COMPANY_BASIC_INFORMATION.NAME} to share with others and how we
						collect and can use your content and information. We encourage you
						to read the Privacy Policy, and to use it to help make informed
						decisions.
					</p>

					<h2>3. User Conduct:</h2>
					<p>
						You agree to use the site only for lawful purposes. You are
						prohibited from posting on or transmitting through{' '}
						{COMPANY_BASIC_INFORMATION.NAME} any unlawful, harmful, threatening,
						abusive, harassing, defamatory, vulgar, obscene, sexually explicit,
						profane, hateful, fraudulent, or racially, ethnically, or otherwise
						objectionable material of any kind, including but not limited to any
						material that encourages conduct that would constitute a criminal
						offense, give rise to civil liability, or otherwise violate any
						applicable local, state, national, or international law.
					</p>

					<h2> 4. Self-Service Promotions</h2>
					<h3>4.1. Service Overview:</h3>
					<p>
						{COMPANY_BASIC_INFORMATION.NAME} offers a self-service &quot;Promote
						Your Listing&quot; feature allowing users to select and promote
						their listings on the platform. This service is available for a
						fixed fee of USD 1 per day, with a 10% discount for bookings over 30
						days.
					</p>

					<h3>4.2. Payment:</h3>
					<p>
						Payments are processed through Stripe. Users must provide valid
						payment information and authorize the applicable fee.
					</p>

					<h3>4.3. Booking and Discount:</h3>
					<p>
						Promotions are booked on available dates selected by the user. A 10%
						discount applies to promotions booked for more than 30 consecutive
						days.
					</p>

					<h3>4.4. Refunds and Cancellations:</h3>
					<p>
						All sales are final. No refunds or cancellations are permitted once
						a promotion is booked.
					</p>

					<h3>4.5. Promotion Display:</h3>
					<p>
						Promoted listings will be displayed prominently on the{' '}
						{COMPANY_BASIC_INFORMATION.NAME}
						platform as per the selected dates. {
							COMPANY_BASIC_INFORMATION.NAME
						}{' '}
						reserves the right to adjust display formats as necessary.
					</p>

					<h3>4.6. Content Restrictions:</h3>
					<p>
						Listings must comply with {COMPANY_BASIC_INFORMATION.NAME}&apos;s
						terms and conditions. No spamming, profanity, or inappropriate
						content is allowed.
						{COMPANY_BASIC_INFORMATION.NAME} reserves the right to deactivate
						any listing that violates these terms without notice or refund.
					</p>

					<h3>4.7. Limitation of Liability:</h3>
					<p>
						{COMPANY_BASIC_INFORMATION.NAME} is not responsible for any loss or
						damage resulting from the use of the promotion service. Users agree
						to use the service at their own risk.
					</p>

					<h3>4.8. Changes to Terms:</h3>
					<p>
						{COMPANY_BASIC_INFORMATION.NAME} reserves the right to modify these
						terms at any time. Users will be notified of any significant
						changes.
					</p>

					<h3>4.9. Acceptance of Terms:</h3>
					<p>
						By using the &quot;Promote Your Listing&quot; feature, users agree
						to these terms and conditions.{' '}
					</p>

					<h2>5. Disclaimer of Warranties:</h2>
					<p>
						The site and the services are provided on an &apos;as is&apos; and
						&apos;as available&apos; basis. {COMPANY_BASIC_INFORMATION.NAME}{' '}
						expressly disclaims all warranties of any kind, whether express or
						implied, including, but not limited to, the implied warranties of
						merchantability, fitness for a particular purpose and
						non-infringement.
					</p>

					<h2>6. Limitation of Liability:</h2>
					<p>
						{COMPANY_BASIC_INFORMATION.NAME} shall not be liable for any direct,
						indirect, incidental, special, consequential or exemplary damages,
						including but not limited to, damages for loss of profits, goodwill,
						use, data or other intangible losses (even if{' '}
						{COMPANY_BASIC_INFORMATION.NAME} has been advised of the possibility
						of such damages), resulting from the use or the inability to use the
						website or any other matter relating to the website.
					</p>

					<h2>7. Changes to the Terms:</h2>
					<p>
						{COMPANY_BASIC_INFORMATION.NAME} reserves the right, at its sole
						discretion, to change, modify, add or remove portions of these Terms
						and Conditions, at any time. It is your responsibility to check
						these Terms and Conditions periodically for changes. Your continued
						use of the Site following the posting of changes will mean that you
						accept and agree to the changes.
					</p>

					<h2>8. Governing Law:</h2>
					<p>
						Any disputes arising out of or related to these Terms and Conditions
						and/or any use by you of the Site shall be governed by the laws of
						Germany, Hamburg, without regard to the conflicts of laws provisions
						therein
					</p>
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>
		</SectionOuterContainer>
	);
}
