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
	title: `Cookie Policy`,
	description: `Cookie Policy by ${COMPANY_BASIC_INFORMATION.NAME}.`,
};

export default function CookiePolicyPage() {
	return (
		<SectionOuterContainer id="Cookie Policy" className="prose">
			<SectionHeaderContainer>
				<SectionTitle>Cookie Policy</SectionTitle>
				<SectionDescription>Last updated May 28, 2024</SectionDescription>
			</SectionHeaderContainer>
			<SubSectionOuterContainer className="max-w-3xl py-0">
				<SubSectionInnerContainer className="items-start prose text-justify dark:prose-invert">
					<p className="text-foreground dark:text-zinc-200">
						This Cookie Policy explains how {COMPANY_BASIC_INFORMATION.NAME}{' '}
						(&apos;Company,&apos; &apos;we,&apos; &apos;us,&apos; and
						&apos;our&apos;) uses cookies and similar technologies to recognize
						you when you visit our website at {COMPANY_BASIC_INFORMATION.URL}{' '}
						(&apos;Website&apos;). It explains what these technologies are and
						why we use them, as well as your rights to control our use of them.
						In some cases we may use cookies to collect personal information, or
						that becomes personal information if we combine it with other
						information.
					</p>

					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						What are cookies?
					</h2>

					<p className="text-foreground dark:text-zinc-200">
						Cookies are small data files that are placed on your computer or
						mobile device when you visit a website. Cookies are widely used by
						website owners in order to make their websites work, or to work more
						efficiently, as well as to provide reporting information. Cookies
						set by the website owner (in this case,{' '}
						{COMPANY_BASIC_INFORMATION.NAME}, a service of{' '}
						{COMPANY_BASIC_INFORMATION.LEGAL_NAME}) are called &apos;first-party
						cookies.&apos; Cookies set by parties other than the website owner
						are called &apos;third-party cookies.&apos; Third-party cookies
						enable third-party features or functionality to be provided on or
						through the website (e.g., advertising, interactive content, and
						analytics). The parties that set these third-party cookies can
						recognize your computer both when it visits the website in question
						and also when it visits certain other websites.
					</p>

					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						Why do we use cookies?
					</h2>

					<p className="text-foreground dark:text-zinc-200">
						We use first- and third-party cookies for several reasons. Some
						cookies are required for technical reasons in order for our Website
						to operate, and we refer to these as &apos;essential&apos; or
						&apos;strictly necessary&apos; cookies. Other cookies also enable us
						to track and target the interests of our users to enhance the
						experience on our Online Properties. Third parties serve cookies
						through our Website for advertising, analytics, and other purposes.
						This is described in more detail below.
					</p>
					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						How can I control cookies?
					</h2>

					<p className="text-foreground dark:text-zinc-200">
						You have the right to decide whether to accept or reject cookies.
						You can exercise your cookie rights by setting your preferences in
						the Cookie Consent Manager. The Cookie Consent Manager allows you to
						select which categories of cookies you accept or reject. Essential
						cookies cannot be rejected as they are strictly necessary to provide
						you with services. The Cookie Consent Manager can be found in the
						notification banner and on our website. If you choose to reject
						cookies, you may still use our website though your access to some
						functionality and areas of our website may be restricted. You may
						also set or amend your web browser controls to accept or refuse
						cookies. The specific types of first- and third-party cookies served
						through our Website and the purposes they perform are described in
						the table below (please note that the specific cookies served may
						vary depending on the specific Online Properties you visit):
					</p>
					<h3 className="my-2 font-extrabold text-gray-700 dark:text-zinc-200">
						Necessary & Functional cookies:
					</h3>
					<ul className="my-2 text-foreground dark:text-zinc-200">
						<li>Name: sb-[id]-auth-token</li>
						<li>Provider: Supabase.com</li>
						<li>Purpose: Authentication & Authorization</li>
						<li>URLs: {`${COMPANY_BASIC_INFORMATION.URL}/*`}</li>
						<li>Type: Session Cookie</li>
						<li>Expires in: After closing the session</li>
					</ul>
					<ul className="my-2 text-foreground dark:text-zinc-200">
						<li>Name: __stripe_mid</li>
						<li>Provider: Stripe.com</li>
						<li>Purpose: Payment & Fraud Prevention</li>
						<li>URLs: {`${COMPANY_BASIC_INFORMATION.URL}/*`}</li>
						<li>Type: Http Cookie</li>
						<li>Expires in: 1 year</li>
					</ul>

					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						How can I control cookies on my browser?
					</h2>

					<p className="text-foreground dark:text-zinc-200">
						As the means by which you can refuse cookies through your web
						browser controls vary from browser to browser, you should visit your
						browser&apos;s help menu for more information. The following is
						information about how to manage cookies on the most popular
						browsers:
					</p>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies"
						>
							Chrome
						</Link>
					</li>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
						>
							Internet Explorer
						</Link>
					</li>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US"
						>
							Firefox
						</Link>
					</li>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac"
						>
							Safari
						</Link>
					</li>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
						>
							Edge
						</Link>
					</li>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="https://help.opera.com/en/latest/web-preferences/"
						>
							Opera
						</Link>
					</li>
					<br />
					<p className="text-foreground dark:text-zinc-200">
						In addition, most advertising networks offer you a way to opt out of
						targeted advertising. If you would like to find out more
						information, please visit:
					</p>

					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="http://www.aboutads.info/choices/"
						>
							Digital Advertising Alliance
						</Link>
					</li>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="https://youradchoices.ca/"
						>
							Digital Advertising Alliance of Canada
						</Link>
					</li>
					<li>
						<Link
							className="text-foreground underline dark:text-zinc-200"
							href="http://www.youronlinechoices.com/"
						>
							European Interactive Digital Advertising Alliance
						</Link>
					</li>
					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						What about other tracking technologies, like web beacons?
					</h2>
					<p className="text-foreground dark:text-zinc-200">
						Cookies are not the only way to recognize or track visitors to a
						website. We may use other, similar technologies from time to time,
						like web beacons (sometimes called &apos;tracking pixels&apos; or
						&apos;clear gifs&apos;). These are tiny graphics files that contain
						a unique identifier that enables us to recognize when someone has
						visited our Website or opened an email including them. This allows
						us, for example, to monitor the traffic patterns of users from one
						page within a website to another, to deliver or communicate with
						cookies, to understand whether you have come to the website from an
						online advertisement displayed on a third-party website, to improve
						site performance, and to measure the success of email marketing
						campaigns. In many instances, these technologies are reliant on
						cookies to function properly, and so declining cookies will impair
						their functioning.
					</p>
					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						Do you serve targeted advertising?
					</h2>
					<p className="text-foreground dark:text-zinc-200">
						Third parties may serve cookies on your computer or mobile device to
						serve advertising through our Website. These companies may use
						information about your visits to this and other websites in order to
						provide relevant advertisements about goods and services that you
						may be interested in. They may also employ technology that is used
						to measure the effectiveness of advertisements. They can accomplish
						this by using cookies or web beacons to collect information about
						your visits to this and other sites in order to provide relevant
						advertisements about goods and services of potential interest to
						you. The information collected through this process does not enable
						us or them to identify your name, contact details, or other details
						that directly identify you unless you choose to provide these.
					</p>
					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						How often will you update this Cookie Policy?
					</h2>
					<p className="text-foreground dark:text-zinc-200">
						We may update this Cookie Policy from time to time in order to
						reflect, for example, changes to the cookies we use or for other
						operational, legal, or regulatory reasons. Please therefore revisit
						this Cookie Policy regularly to stay informed about our use of
						cookies and related technologies. The date at the top of this Cookie
						Policy indicates when it was last updated.
					</p>
					<h2 className="my-3 font-extrabold text-gray-900 dark:text-zinc-200">
						Where can I get further information?
					</h2>
					<p className="text-foreground dark:text-zinc-200">
						If you have any questions about our use of cookies or other
						technologies, please email us at{' '}
						{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL} or by mail to:
					</p>
					<ul className="my-2 text-foreground dark:text-zinc-200">
						<li>{COMPANY_BASIC_INFORMATION.RESPONSIBLE_PERSON}</li>
						<li>{COMPANY_BASIC_INFORMATION.ADDRESS || ''}</li>
					</ul>
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>
		</SectionOuterContainer>
	);
}
