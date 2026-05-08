import React, { lazy, startTransition, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroOverlay from '../components/sections/IntroOverlay';
import Hero from '../components/sections/Hero';
import HomeMarquee from '../components/sections/HomeMarquee';
import SignatureDishes from '../components/sections/SignatureDishes';
import Preloader from '../components/ui/Preloader';
import { useLayout } from '../components/layout/Layout';

const HomeDeferredSections = lazy(
  () => import('../components/sections/HomeDeferredSections'),
);

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEntered, setIsEntered] = useState(false);
  const [shouldLoadDeferredSections, setShouldLoadDeferredSections] = useState(false);
  const { setIsFrameVisible } = useLayout();

  useEffect(() => {
     setIsFrameVisible(false);
  }, [setIsFrameVisible]);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setShouldLoadDeferredSections(true);
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isLoading]);

  const handleEnter = () => {
      setIsEntered(true);
      setIsFrameVisible(true);
  };

  return (
    <main className="relative bg-black w-full overflow-x-hidden">
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
         <div className="flex flex-col">
            <Hero isEntered={isEntered} />
            <HomeMarquee />
            <SignatureDishes isEntered={isEntered} />
            {shouldLoadDeferredSections ? (
              <Suspense fallback={null}>
                <HomeDeferredSections />
              </Suspense>
            ) : null}
         </div>
      )}

      {!isLoading && !isEntered && (
        <IntroOverlay onEnter={handleEnter} />
      )}
    </main>
  );
};

export default Home;
