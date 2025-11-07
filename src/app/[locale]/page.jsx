import dynamic from 'next/dynamic';
import HeroSection from '@/sections/HeroSection';
import Incentives from '@/sections/Incentives';

// Lazy load below-the-fold components to improve FCP
const FeatureSection = dynamic(() => import('@/sections/FeatureSection'));
const OurStory = dynamic(() => import('@/sections/OurStory'));
const FeatureFourColumns = dynamic(() => import('@/sections/FeatureFourColumns'));
const SupportSection = dynamic(() => import('@/sections/SupportSection'));
const NewsLetterSection = dynamic(() => import('@/sections/NewsLetterSection'));

export default function HomePage() {
  return (
    <div>
      {/* Critical above-the-fold content - loaded immediately */}
      <HeroSection />
      <Incentives />
      
      {/* Below-the-fold content - lazy loaded */}
      <FeatureSection />
      <OurStory />
      <FeatureFourColumns />
      <SupportSection />
      <NewsLetterSection />
    </div>
  );
}
