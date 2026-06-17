'use client';
// Import Types
// Import External Packages
import { useFormState } from 'react-dom';
// Import Components
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
import { Label } from '@/ui/Label';
import { Input } from '@/ui/Input';
import {
	SectionDescription,
	SectionOuterContainer,
	SectionTitle,
	SubSectionInnerContainer,
	SubSectionOuterContainer,
} from '@/ui/Section';
// Import Functions & Actions & Hooks & State
import insertFeedback from '@/actions/feedback/insertFeedback';
// Import Data
import { GENERAL_SETTINGS } from '@/constants';
// Import Assets & Icons

export default function ProposePage() {
	const [state, formAction] = useFormState(insertFeedback, undefined);

	return (
		<SectionOuterContainer className="max-w-3xl">
			<SectionTitle>Want to Contribute? Propose a listing!</SectionTitle>
			<SectionDescription>
				Help the community and us grow. Fill our collections by proposing
				suitable listings.{' '}
				{GENERAL_SETTINGS.USE_PUBLISH && (
					<>
						Just fyi: We do allow direct user submissions. You can create an
						account and directly submit the listing yourself, if you want.
					</>
				)}
			</SectionDescription>

			<SubSectionOuterContainer>
				<SubSectionInnerContainer>
					{!state?.success ? (
						<form action={formAction}>
							<div className="grid gap-4">
								<div>
									<Input
										id="feedback_type"
										value="propose"
										name="feedback_type"
										type="hidden"
									/>
								</div>
								<div>
									<Label htmlFor="url">URL</Label>
									<Input
										id="url"
										placeholder="https://example.com"
										name="url"
										type="text"
									/>
									{state?.errors?.url && state?.errors?.url?.length > 0 && (
										<div className="text-red-500 text-xs">
											<p>Url must:</p>
											<ul>
												{state.errors.url.map((error: string) => (
													<li key={error}>- {error}</li>
												))}
											</ul>
										</div>
									)}
								</div>
								<div>
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										placeholder="This website fits optimally because..."
										name="description"
									/>
									{state?.errors?.description &&
										state?.errors?.description?.length > 0 && (
											<div className="text-red-500 text-xs">
												<p>Description must:</p>
												<ul>
													{state.errors.description.map((error: string) => (
														<li key={error}>- {error}</li>
													))}
												</ul>
											</div>
										)}
								</div>

								<div>
									<Label htmlFor="email">
										Your email (optional, if you want to hear from us back)
									</Label>
									<Input
										id="email"
										placeholder="you@example.com"
										name="email"
										type="email"
									/>
									{state?.errors?.email && state?.errors?.email?.length > 0 && (
										<div className="text-red-500 text-xs">
											<p>Email must:</p>
											<ul>
												{state.errors.email.map((error: string) => (
													<li key={error}>- {error}</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
							<Button
								variant="default"
								type="submit"
								size="lg"
								disabled={state?.success}
								className="mt-4"
							>
								Submit
							</Button>
						</form>
					) : (
						<p className="flex max-w-xl">
							Thank you for your contribution! If you entered your email, we
							will get back to you soon.
						</p>
					)}
				</SubSectionInnerContainer>
			</SubSectionOuterContainer>
		</SectionOuterContainer>
	);
}
