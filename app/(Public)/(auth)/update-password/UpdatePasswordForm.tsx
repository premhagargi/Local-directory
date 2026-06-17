'use client';

// Import Types
// Import External Packages
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
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
import updatePassword from '@/actions/auth/updatePassword';
import { toast } from '@/lib/useToaster';
// Import Data
// Import Assets & Icons
import { LoaderCircleIcon } from 'lucide-react';

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

export default function UpdatePasswordPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: '',
		},
	});

	async function onSubmit(values: FormValues) {
		setIsSubmitting(true);
		try {
			const result = await updatePassword(values);
			if (result.success) {
				toast({
					title: 'Password updated successfully',
					description:
						'Your password has been updated. Redirecting to your account...',
				});
				router.push('/account');
			} else {
				toast({
					variant: 'destructive',
					title: 'Failed to update password',
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
			console.error('Update password error:', error);
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
			<div className="mx-auto max-w-3xl grid space-y-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card className="w-full min-w-96 max-w-sm">
							<CardHeader>
								<CardTitle className="text-2xl">Update Password</CardTitle>
								<CardDescription>Enter your new password.</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter your new password"
													{...field}
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
										'Update Password'
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
