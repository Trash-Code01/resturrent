import React from 'react';
import HomeStoryTeaser from './HomeStoryTeaser';
import ChefSection from './ChefSection';
import AtmosphereSection from './AtmosphereSection';
import MenuPreview from './MenuPreview';
import LoungeSection from './LoungeSection';
import InspireReviews from './InspireReviews';
import VisitSection from './VisitSection';
import ReservationBanner from './ReservationBanner';
import Ambiance from './Ambiance';
import InstaReels from './InstaReels';
import Footer from './Footer';

const HomeDeferredSections = () => {
  return (
    <>
      <HomeStoryTeaser />
      <ChefSection />
      <AtmosphereSection />
      <MenuPreview />
      <LoungeSection />
      <InspireReviews />
      <VisitSection />
      <ReservationBanner />
      <Ambiance />
      <InstaReels />
      <Footer />
    </>
  );
};

export default HomeDeferredSections;
