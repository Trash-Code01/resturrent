import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { isClerkConfigured } from '../../lib/env';
import { ADMIN_ACCESS_ROUTE, ADMIN_PANEL_ROUTE } from '../../lib/routes';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Story', to: '/story' },
  { label: 'Reservations', to: '/reservations' },
  { label: 'Contact', to: '/contact' },
];

const HomeIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.5'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MenuDishIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.5'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const ReserveIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.5'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ContactPhoneIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.5'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const bottomTabs = [
  { label: 'Home', to: '/', Icon: HomeIcon },
  { label: 'Menu', to: '/menu', Icon: MenuDishIcon },
  { label: 'Reserve', to: '/reservations', Icon: ReserveIcon },
  { label: 'Contact', to: '/contact', Icon: ContactPhoneIcon },
];

const desktopButtonClasses =
  'px-8 py-3 border text-xs uppercase tracking-[0.2em] transition-all duration-300';

const mobileButtonClasses =
  'group relative block w-full overflow-hidden border py-4 text-center text-[10px] uppercase tracking-[0.3em]';

const AuthDesktop = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAdmin } = useAdminAccess();
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/sign-in' ||
    location.pathname === '/sign-up' ||
    location.pathname === ADMIN_ACCESS_ROUTE;
  const authRedirect =
    isAuthPage || location.pathname === '/'
      ? '/my-account'
      : `${location.pathname}${location.search}${location.hash}`;
  const signInUrl = `/sign-in?redirect=${encodeURIComponent(authRedirect)}`;

  if (!isClerkConfigured) {
    return null;
  }

  if (isAuthPage && !isSignedIn) {
    return null;
  }

  if (!isLoaded) {
    return <div className="h-[46px] w-[138px] border border-white/10 bg-white/[0.03]" />;
  }

  if (!isSignedIn) {
    return (
      <Link
        to={signInUrl}
        onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
        className={clsx(
          desktopButtonClasses,
          'border-white/20 text-white hover:border-white hover:bg-white hover:text-black',
        )}
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to={isAdmin ? ADMIN_PANEL_ROUTE : '/my-account'}
        className={clsx(
          desktopButtonClasses,
          'border-white/20 text-white hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black',
        )}
      >
        {isAdmin ? 'Back Office' : 'My Account'}
      </Link>
    </div>
  );
};

const AuthMobile = ({ onClose }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAdmin } = useAdminAccess();
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/sign-in' ||
    location.pathname === '/sign-up' ||
    location.pathname === ADMIN_ACCESS_ROUTE;
  const authRedirect =
    isAuthPage || location.pathname === '/'
      ? '/my-account'
      : `${location.pathname}${location.search}${location.hash}`;
  const signInUrl = `/sign-in?redirect=${encodeURIComponent(authRedirect)}`;

  if (!isClerkConfigured) {
    return null;
  }

  if (isAuthPage && !isSignedIn) {
    return null;
  }

  if (!isLoaded) {
    return <div className="h-14 w-full border border-white/10 bg-white/[0.03]" />;
  }

  if (!isSignedIn) {
    return (
      <Link
        to={signInUrl}
        onClick={onClose}
        className={clsx(
          mobileButtonClasses,
          'border-white/15 text-white hover:border-white hover:bg-white hover:text-black',
        )}
      >
        <span className="relative z-10">Login</span>
      </Link>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        to={isAdmin ? ADMIN_PANEL_ROUTE : '/my-account'}
        onClick={onClose}
        className={clsx(
          mobileButtonClasses,
          'border-white/15 text-white hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black',
        )}
      >
        <span className="relative z-10">
          {isAdmin ? 'Back Office' : 'My Account'}
        </span>
      </Link>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setIsScrolled(current > 50);

      if (current < 80) {
        setShowBottomNav(true);
      } else if (current > lastScrollY.current) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }

      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const go = () => {
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <>
      <nav
        className={clsx(
          'fixed left-0 top-0 z-[60] w-full border-b border-transparent px-6 transition-all duration-500 md:px-12',
          isScrolled || isDrawerOpen
            ? 'border-white/10 bg-[#030303]/90 py-4 backdrop-blur-xl md:py-5'
            : 'bg-transparent py-6 md:py-8',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            onClick={go}
            className="relative z-10 py-2 font-serif text-2xl uppercase tracking-widest text-white transition-colors duration-300 hover:text-[#d4af37] md:text-3xl"
          >
            OBSIDIAN
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ label, to }) => (
              <li key={label} className="group relative">
                <Link
                  to={to}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                  className={clsx(
                    'block py-2 text-xs uppercase tracking-[0.25em] transition-colors duration-300',
                    location.pathname === to
                      ? 'text-[#d4af37]'
                      : 'text-white/70 group-hover:text-[#d4af37]',
                  )}
                >
                  {label}
                </Link>
                <span
                  className={clsx(
                    'absolute bottom-0 left-0 h-px bg-[#d4af37] transition-all duration-300 group-hover:w-full',
                    location.pathname === to ? 'w-full' : 'w-0',
                  )}
                />
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <AuthDesktop />
            <Link
              to="/reservations"
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
              className={clsx(
                desktopButtonClasses,
                'border-white/20 text-white hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black',
              )}
            >
              Book Now
            </Link>
          </div>

          <button
            onClick={() => setIsDrawerOpen((currentValue) => !currentValue)}
            className="relative z-[70] flex h-9 w-9 flex-col items-center justify-center gap-[5px] focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={clsx(
                'block h-[1.5px] w-6 origin-center transition-all duration-400',
                isDrawerOpen
                  ? 'translate-y-[6.5px] rotate-45 bg-[#d4af37]'
                  : 'bg-white',
              )}
            />
            <span
              className={clsx(
                'block h-[1.5px] transition-all duration-400',
                isDrawerOpen ? 'w-0 opacity-0' : 'w-6 bg-white',
              )}
            />
            <span
              className={clsx(
                'block h-[1.5px] w-6 origin-center transition-all duration-400',
                isDrawerOpen
                  ? '-translate-y-[6.5px] -rotate-45 bg-[#d4af37]'
                  : 'bg-white',
              )}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[65] flex h-[100dvh] w-screen flex-col overflow-y-auto bg-[#030303] px-6 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-[calc(6.25rem+env(safe-area-inset-top))] sm:px-8 md:hidden"
            >
              <div className="pointer-events-none absolute right-0 top-1/3 h-48 w-48 rounded-full bg-[#d4af37]/5 blur-[80px]" />
              <div className="pointer-events-none absolute left-[-4rem] bottom-20 h-56 w-56 rounded-full bg-white/[0.025] blur-[110px]" />
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="absolute right-6 top-[calc(1.5rem+env(safe-area-inset-top))] flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-white/60 transition-colors duration-300 hover:border-[#d4af37]/40 hover:text-[#d4af37] sm:right-8"
                aria-label="Close menu"
              >
                <span>Close</span>
                <span className="relative h-3.5 w-3.5">
                  <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                  <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
                </span>
              </button>

              <p className="mb-10 text-[9px] font-semibold uppercase tracking-[0.45em] text-[#d4af37]/60">
                Navigation
              </p>

              <ul className="flex-1 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + index * 0.07,
                      duration: 0.4,
                      ease: 'easeOut',
                    }}
                  >
                    <Link
                      to={link.to}
                      onClick={go}
                      className={clsx(
                        'group flex items-center justify-between border-b border-white/[0.04] py-5 transition-colors duration-300',
                        location.pathname === link.to
                          ? 'text-[#d4af37]'
                          : 'text-white/50 hover:text-white',
                      )}
                    >
                      <span className="font-serif text-2xl tracking-wide">
                        {link.label}
                      </span>
                      <span
                        className={clsx(
                          'text-base transition-all duration-300 group-hover:translate-x-1',
                          location.pathname === link.to
                            ? 'text-[#d4af37]'
                            : 'text-white/10 group-hover:text-white/40',
                        )}
                      >
                        →
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="mt-auto space-y-6 pt-8"
              >
                <div>
                  <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-white/20">
                    Account
                  </p>
                  <AuthMobile onClose={() => setIsDrawerOpen(false)} />
                </div>

                <div>
                  <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-white/20">
                    Fine Dining · New York
                  </p>
                  <Link
                    to="/reservations"
                    onClick={go}
                    className="group relative block w-full overflow-hidden border border-[#d4af37]/30 py-4 text-center text-[10px] uppercase tracking-[0.3em] text-[#d4af37]"
                  >
                    <div className="absolute inset-0 origin-left scale-x-0 bg-[#d4af37] transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                      Reserve Your Table
                    </span>
                  </Link>
                </div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBottomNav && (
          <motion.div
            key="bottomnav"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="border-t border-white/10 bg-[#030303]/95 pb-[calc(0.9rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
              <div className="mx-auto flex max-w-md items-stretch justify-around px-4">
                {bottomTabs.map(({ label, to, Icon }) => {
                  const active = location.pathname === to;

                  return (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                      className="relative flex flex-1 flex-col items-center justify-center gap-1.5 py-1"
                    >
                      <div
                        className={clsx(
                          'relative z-10 transition-colors duration-300',
                          active ? 'text-[#d4af37]' : 'text-white/40',
                        )}
                      >
                        <Icon active={active} />
                      </div>

                      <span
                        className={clsx(
                          'relative z-10 text-[9px] font-semibold uppercase tracking-wider transition-colors duration-300',
                          active ? 'text-[#d4af37]' : 'text-white/40',
                        )}
                      >
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="h-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
