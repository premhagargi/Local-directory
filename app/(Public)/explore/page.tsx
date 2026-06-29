// Import Types
import { Metadata } from 'next/types';
// Import Components
import LandingPage from '../page';
// Import Functions
import createMetaData from '@/lib/createMetaData';
// Import Data
import { COMPANY_BASIC_INFORMATION } from '@/constants';

export const metadata: Metadata = createMetaData({
	customTitle: 'Explore',
	customDescription: `See, filter and sort all listings on ${COMPANY_BASIC_INFORMATION.NAME}. Find the best creators in the world. Get inspired by their work and hire them for your next project`,
	customSlug: `explore`,
});

export default LandingPage;
