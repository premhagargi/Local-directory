// Import Types
// Import External Packages
// Import Components
import Navbar_Public from '@/components/Navbar_Public';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="min-h-screen">
			<Navbar_Public />

			{children}
		</section>
	);
}
