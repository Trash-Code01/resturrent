import React, { useState, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { ADMIN_ACCESS_ROUTE } from '../../lib/routes';

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

const Layout = ({ children }) => {
  const [isFrameVisible, setIsFrameVisible] = useState(true);
  const location = useLocation();
  const isAuthRoute =
    location.pathname === '/sign-in' ||
    location.pathname === '/sign-up' ||
    location.pathname === ADMIN_ACCESS_ROUTE;
  const shouldShowFrame = isFrameVisible && !isAuthRoute;

  return (
    <LayoutContext.Provider value={{ isFrameVisible, setIsFrameVisible }}>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-500 selection:text-black">
        {/* Navbar and Footer are conditionally rendered based on Frame Visibility */}
        <div className={`transition-opacity duration-1000 ${shouldShowFrame ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             <Navbar />
        </div>
        
        <main>
          {children}
        </main>

        {/* Global Footer removed to allow pages to render their own custom footers (e.g. Footer.jsx) */}
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;
