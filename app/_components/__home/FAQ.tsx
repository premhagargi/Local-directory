'use client';

// Import Types
// Import External Packages
import { Disclosure } from '@headlessui/react';
// Import Components
import {
	SubSectionOuterContainer,
	SubSectionInnerContainer,
	SubSectionTitle,
	SubSectionDescription,
	SubSectionContentContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons
import { MinusSquareIcon, PlusIcon, PlusSquareIcon } from 'lucide-react';

// What are the FAQs you want to show on the front page?

export const GENERAL_FAQS: { question: string; answer: string }[] = [
	{
		question: 'How can I delete my account?',
		answer:
			"You can delete your account at any time by visiting the '/account' section after logging in. Please note that deleting your account is irreversible and will result in the removal of all your data from our system.",
	},
	{
		question: 'How do I update my account information?',
		answer:
			'You can update your account information by logging into your account and accessing the account settings section. From there, you can modify your profile details and save changes.',
	},
	{
		question: 'What should I do if I forget my password?',
		answer:
			"If you forget your password, you can reset it by clicking on the 'Forgot Password' link on the login page. Follow the instructions provided to receive an email with steps to reset your password.",
	},
	{
		question: 'How do I contact customer support?',
		answer:
			'If you need assistance or have any queries, please contact our customer support team by sending an email to support@SOME_URL.com. We aim to respond to all inquiries within 24 hours.',
	},
];

/**
 * Renders a Frequently Asked Questions (FAQ) component.
 * @param title - The title of the FAQ section.
 * @param description - The description of the FAQ section.
 * @param faqs - An array of FAQ objects.
 * @param className - The CSS class name for the component.
 * @returns The rendered FAQ component.
 */
export default function FAQ({
	title = 'Frequently Asked Questions',
	description = 'We have compiled a list of frequently asked questions. If you have any other questions, please do not hesitate to contact us via email. We are here to help!',
	className,
}: {
	title?: string;
	description?: string;
	className?: string;
}) {
	return (
		<SubSectionOuterContainer id="faq" className={className}>
			<SubSectionInnerContainer>
				<SubSectionTitle>{title}</SubSectionTitle>
				{description && (
					<SubSectionDescription>{description}</SubSectionDescription>
				)}

				<SubSectionContentContainer className=" mt-6">
					<dl className="space-y-6 divide-y divide-neutral-200 dark:divide-white">
						{GENERAL_FAQS.map(
							(faq) =>
								faq.question &&
								faq.answer && (
									<Disclosure as="div" key={faq.question} className="pt-6">
										{({ open }) => (
											<>
												<dt>
													<Disclosure.Button className="flex w-full items-start justify-between text-left ">
														<span className="text-base font-semibold leading-7 dark:text-white">
															{faq.question}
														</span>
														<span className="ml-6 flex h-7 items-center text-foreground dark:text-white">
															{open ? (
																<MinusSquareIcon
																	className="h-6 w-6"
																	aria-hidden="true"
																/>
															) : (
																<PlusIcon
																	className="h-6 w-6"
																	aria-hidden="true"
																/>
															)}
														</span>
													</Disclosure.Button>
												</dt>
												<Disclosure.Panel as="dd" className="mt-2 pr-12">
													<p className="text-base text-justify leading-7 dark:text-white">
														{faq.answer}
													</p>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								)
						)}
					</dl>
				</SubSectionContentContainer>
			</SubSectionInnerContainer>
		</SubSectionOuterContainer>
	);
}
