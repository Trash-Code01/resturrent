import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLayout } from '../layout/Layout';

const AuthShell = ({
  eyebrow,
  title,
  description,
  children,
}) => {
  const { setIsFrameVisible } = useLayout();

  useEffect(() => {
    setIsFrameVisible(false);

    return () => {
      setIsFrameVisible(true);
    };
  }, [setIsFrameVisible]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050607] text-white">
      <div className="pointer-events-none absolute left-[-140px] top-20 h-[360px] w-[360px] rounded-full bg-[#c8a75e]/10 blur-[160px]" />
      <div className="pointer-events-none absolute right-[-120px] top-32 h-[300px] w-[300px] rounded-full bg-white/[0.04] blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-[320px] w-[320px] rounded-full bg-[#c8a75e]/6 blur-[170px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '112px 112px',
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 md:px-10">
        <div className="w-full max-w-[460px]">
          <Link
            to="/"
            className="mx-auto block w-fit font-serif text-[2rem] uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:text-[#d4af37]"
          >
            Obsidian
          </Link>

          <div className="mt-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8a75e]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[2.5rem]">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/56">
              {description}
            </p>
          </div>

          <div className="mt-8 w-full">
            {children}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.22em] text-white/38">
            <Link
              to="/"
              className="transition-colors duration-300 hover:text-white"
            >
              Return Home
            </Link>
            <span className="h-3 w-px bg-white/12" />
            <Link
              to="/reservations"
              className="transition-colors duration-300 hover:text-[#d4af37]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
