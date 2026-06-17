'use client';

// Import Types
// Import External Packages
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
// Import Components
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/ui/Card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/ui/Form';
// Import Functions & Actions & Hooks & State
import login from '@/actions/auth/login';
import { toast } from '@/lib/useToaster';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { LoaderCircleIcon } from 'lucide-react';

const LoginFormSchema = z.object({
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
});
type FormValues = z.infer<typeof LoginFormSchema>;

export default function SignInPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [attemptCount, setAttemptCount] = useState(0);
	const [waitTime, setWaitTime] = useState(0);

	useEffect(() => {
		if (waitTime > 0) {
			const timer = setInterval(() => {
				setWaitTime((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [waitTime]);

	const form = useForm<FormValues>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: FormValues) {
		if (waitTime > 0) {
			toast({
				variant: 'destructive',
				title: 'Please wait',
				description: `You must wait ${waitTime} seconds before trying again.`,
			});
			setWaitTime((prev) => prev + 30);
			return;
		}
		setIsSubmitting(true);
		try {
			const result = await login(values);
			if (result && !result.success) {
				toast({
					variant: 'destructive',
					title: 'Login failed',
					description: 'You have entered an invalid username or password.',
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
				setAttemptCount((prev) => prev + 1);
				if (attemptCount >= 2) {
					setWaitTime(30);
				}
			}
		} catch (error) {
			if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
				toast({
					title: 'Login successful',
					description: 'You have been successfully logged in.',
				});
				setAttemptCount(0);
			} else {
				toast({
					variant: 'destructive',
					title: 'An error occurred',
					description: 'Please try again later.',
				});
				setAttemptCount((prev) => prev + 1);
				if (attemptCount >= 2) {
					setWaitTime(30);
				}
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="mt-12 flex dark:text-white">
			<div className="mx-auto max-w-3xl grid space-y-6">
				<h1 className="text-xl font-bold text-center">
					Sign In to {COMPANY_BASIC_INFORMATION.NAME}
				</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card className="w-full min-w-96 max-w-sm">
							<CardHeader>
								<CardTitle className="text-2xl">Login</CardTitle>
								<CardDescription>
									Enter your email below to login to your account.
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
												<Input
													placeholder="you@example.com"
													{...field}
													type="email"
													autoComplete="email"
													required
												/>
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
												<Input
													type="password"
													{...field}
													autoComplete="current-password"
													required
												/>
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
									) : waitTime > 0 ? (
										`Wait ${waitTime} seconds`
									) : (
										'Sign In'
									)}
								</Button>
							</CardFooter>
						</Card>
						<div className="w-full mt-2 text-center">
							<Link
								href="/sign-up"
								className="leading-6 underline text-muted-foreground"
							>
								Click here to sign-up instead!
							</Link>
						</div>
						<div className="w-full mt-2 text-center">
							<Link
								href="/forgot-password"
								className="leading-6 underline text-muted-foreground"
							>
								Forgot Password?
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
