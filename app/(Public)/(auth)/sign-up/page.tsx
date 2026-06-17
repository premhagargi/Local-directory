'use client';

// Import Types
import Link from 'next/link';
// Import External Packages
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Import Components
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/ui/Form';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/ui/Card';
// Import Functions & Actions & Hooks & State
import signup from '@/actions/auth/signup';
import { cn } from '@/lib/utils';
// Import Data
import { GENERAL_SETTINGS, COMPANY_BASIC_INFORMATION } from '@/constants';
import { Roles, signupOptions } from '@/rbac';
import { toast } from '@/lib/useToaster';
// Import Assets & Icons
import { AlertCircle, LoaderCircleIcon, MailOpenIcon } from 'lucide-react';

const SignupFormSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
	password: z
		.string()
		.min(8, { message: 'Be at least 8 characters long' })
		.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
		.regex(/[0-9]/, { message: 'Contain at least one number.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Contain at least one special character.',
		})
		.max(72, { message: 'Be at most 72 characters long' })
		.trim(),
	role: z
		.nativeEnum(Roles, {
			message: 'Wrong user role provided. Contact Support!',
		})
		.nullable(),
});

type FormValues = z.infer<typeof SignupFormSchema>;

export default function Page() {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<FormValues>({
		resolver: zodResolver(SignupFormSchema),
		defaultValues: {
			email: '',
			password: '',
			role: GENERAL_SETTINGS.USE_RBAC ? signupOptions[0].internalCode : null,
		},
	});

	async function onSubmit(values: FormValues) {
		setIsSubmitting(true);
		try {
			const result = await signup(values);
			if (result.success) {
				setIsSuccess(true);
				toast({
					title: 'Sign up successful',
					description: 'Please check your email to confirm your account.',
				});
			} else {
				toast({
					variant: 'destructive',
					title: 'Sign up failed',
					description:
						'There was an error signing you up. Please try again later or contact support.',
				});
				if (result.errors) {
					Object.entries(result.errors).forEach(([key, value]) => {
						form.setError(key as keyof FormValues, {
							type: 'manual',
							message: Array.isArray(value)
								? value.join(', ')
								: (value as string),
						});
					});
				}
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occurred',
				description: 'Please try again later.',
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="mt-12 flex dark:text-white">
			<div className="max-3-xl mx-auto grid space-y-6">
				<h1 className="text-xl font-bold text-center">
					Sign Up to {COMPANY_BASIC_INFORMATION.NAME}
				</h1>

				{GENERAL_SETTINGS.USE_PUBLISH ? (
					isSuccess ? (
						<div className="mx-auto max-w-md text-center pt-12">
							<MailOpenIcon className="mx-auto h-12 w-12 text-primary" />
							<h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Check Your Email
							</h1>
							<p className="mt-4 text-muted-foreground">
								We&apos;ve sent a confirmation link to your email address.
								Please check your inbox and click the link to complete your
								registration.
							</p>
						</div>
					) : (
						<div>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<Card className="w-fit max-w-xl">
										<CardHeader>
											<CardTitle className="text-2xl">Sign up</CardTitle>
											<CardDescription>
												Enter your email below to sign up.
											</CardDescription>
										</CardHeader>
										<CardContent className="grid gap-4">
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input placeholder="you@example.com" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="password"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Password</FormLabel>
														<FormControl>
															<Input type="password" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="role"
												render={({ field }) => (
													<FormItem>
														{GENERAL_SETTINGS.USE_RBAC ? (
															<FormLabel>
																Select a situation that describes you best
															</FormLabel>
														) : null}
														<FormControl>
															{!GENERAL_SETTINGS.USE_RBAC ? (
																<Input disabled type="hidden" />
															) : (
																<div
																	className={cn(
																		'grid grid-flow-row md:grid-flow-col rounded-lg p-1 space-y-1 md:space-x-1 md:space-y-0 bg-muted',
																		`md:grid-cols-${signupOptions.length}`
																	)}
																>
																	{signupOptions.map((option) => (
																		<Button
																			key={option.internalCode}
																			type="button"
																			variant={
																				field.value === option.internalCode
																					? 'outline'
																					: 'ghost'
																			}
																			className={cn(
																				'border border-muted-foreground/20 hover:border-primary h-auto justify-start items-start whitespace-normal p-4',
																				field.value === option.internalCode &&
																					' border-primary hover:bg-white'
																			)}
																			onClick={() =>
																				field.onChange(option.internalCode)
																			}
																		>
																			<div className="grid items-start text-left space-y-3">
																				<option.lucide_icon size={20} />
																				<span className="font-semibold">
																					{option.title}
																				</span>
																				<span className="text-muted-foreground">
																					{option.description}
																				</span>
																			</div>
																		</Button>
																	))}
																</div>
															)}
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</CardContent>
										<CardFooter>
											<Button
												type="submit"
												className="w-full"
												disabled={isSubmitting}
											>
												{isSubmitting ? (
													<span className={isSubmitting ? 'animate-spin' : ''}>
														<LoaderCircleIcon />
													</span>
												) : (
													'Sign Up'
												)}
											</Button>
										</CardFooter>
									</Card>
								</form>
							</Form>

							<div className="w-full mt-2 text-center">
								<Link
									href="/sign-in"
									className="leading-6 underline text-muted-foreground"
								>
									Click here to sign-in instead!
								</Link>
							</div>
						</div>
					)
				) : (
					<Alert
						variant="destructive"
						className="bg-white w-fit h-fit mx-auto text-left"
					>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Heads up!</AlertTitle>
						<AlertDescription>
							At this moment, we do not allow signups. Write us an email if you
							have any questions: {COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}.
						</AlertDescription>
					</Alert>
				)}
			</div>
		</div>
	);
}
