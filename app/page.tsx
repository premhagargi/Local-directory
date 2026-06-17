// Import Types
// Import External Packages
// Import Components
import CategoryQuickLinks from '@/components/__home/CategoryQuickLinks';
import ListingOverview from '@/components/listings/ListingOverview';
import Navbar_Public from '@/components/Navbar_Public';
import { SectionOuterContainer } from '@/ui/Section';
import MainHero from '@/components/__home/MainHero';
import Breaker from '@/components/__home/Breaker';
import FAQ from '@/components/__home/FAQ';
import NewsletterBox_BeeHiiv from '@/components/NewsletterSection';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

export default async function Page() {
	return (
		<>
			<Navbar_Public />

			<SectionOuterContainer className="mx-auto py-0">
				<MainHero />

				<ListingOverview
					title="The Most Liked"
					buttonText="Show all best rated listings"
					buttonHref="/explore?sort=mostPopular"
					filterAndSortParams={{ sort: 'mostPopular' }}
					maxNumListings={3}
					preferPromoted
					showPagination={false}
					showSearch={false}
				/>

				<Breaker
					className="bg-background-secondary"
					imageSrc="/img/entrepreneur.jpg"
					imageAlt="directory entrepreneur proposes listing"
					subHeadline="Know any missing listings?"
					headline="Propose A Listing"
					description="Help us grow our directory by proposing a listing that you think should be included. We appreciate your help!"
					buttonText="+ Propose a listing"
					buttonHref="/propose"
				/>

				<ListingOverview
					title="Recently Added"
					buttonText="Show more new listings"
					buttonHref="/explore?sort=newest"
					filterAndSortParams={{ sort: 'newest' }}
					maxNumListings={3}
					maxCols={3}
					showPagination={false}
					showSearch={false}
				/>

				<NewsletterBox_BeeHiiv />

				<CategoryQuickLinks />

				<FAQ className="py-14 mx-auto text-center bg-background-secondary" />
				<Breaker
					className=""
					imageSrc="/img/directory.jpg"
					imageAlt="directory business image"
					subHeadline="Have Your Own Tool?"
					headline="Claim Your Listing Today"
					description="Whether you're just getting started or looking to grow your business, we have the tools and resources to help you succeed."
					buttonText="Claim your listing"
					buttonHref="/account"
				/>
			</SectionOuterContainer>
		</>
	);
}
