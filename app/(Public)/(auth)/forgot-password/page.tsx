'use client';

// Import Types
// Import External Packages
import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
// Import Components
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
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
import forgotPassword from '@/actions/auth/forgotPassword';
import { toast } from '@/lib/useToaster';
// Import Data
// Import Assets & Icons
import { LoaderCircleIcon, MailIcon } from 'lucide-react';

const formSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	async function onSubmit(values: FormValues) {
		setIsSubmitting(true);
		try {
			const result = await forgotPassword(values);
			if (result.success) {
				setIsSuccess(true);
			} else {
				toast({
					variant: 'destructive',
					title: 'Failed to send reset link',
					description: result.error,
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
			console.error('Forgot password error:', error);
			toast({
				variant: 'destructive',
				title: 'An error occurred',
				description: 'Please try again later.',
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	if (isSuccess) {
		return (
			<div className="mt-12 flex justify-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<div className="flex items-center space-x-2">
							<MailIcon className="h-6 w-6 text-primary" />
							<CardTitle className="text-2xl font-semibold">
								Check Your Email
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-lg text-muted-foreground">
							We&apos;ve sent a password reset link to your email address.
							Please check your inbox and follow the instructions to reset your
							password.
						</p>
					</CardContent>
					<CardFooter>
						<Button asChild className="w-full">
							<Link href="/sign-in">Return to Sign In</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="mt-12 flex dark:text-white">
			<div className="mx-auto max-w-3xl grid space-y-6">
				<h1 className="text-xl font-bold text-center">Forgot Password</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card className="w-full min-w-96 max-w-sm">
							<CardHeader>
								<CardTitle className="text-2xl">Send Reset Link</CardTitle>
								<CardDescription>
									Enter your email below to get a reset link.
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
							</CardContent>
							<CardFooter>
								<Button
									type="submit"
									className="w-full"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
									) : (
										'Send Reset Link'
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
		</div>
	);
}
