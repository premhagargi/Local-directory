// Import Types
// Import External Packages
// Import Components
import { Alert, AlertDescription, AlertTitle } from '@/ui/Alert';
// Import Functions & Actions & Hooks & State
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';
// Import Error Handling

export default function AccessDenied() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<Alert variant="destructive" className="w-full max-w-2xl">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle className="text-lg font-semibold">Access Denied</AlertTitle>
				<AlertDescription className="mt-2 text-sm">
					You don&apos;t have sufficient permissions to perform this action or
					visit this site. Please contact please contact support:{' '}
					{COMPANY_BASIC_INFORMATION.SUPPORT_EMAIL}, if you believe this is an
					error.
				</AlertDescription>
			</Alert>
		</div>
	);
}
