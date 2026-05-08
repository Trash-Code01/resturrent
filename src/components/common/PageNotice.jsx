import React from 'react';
import { Link } from 'react-router-dom';

const PageNotice = ({
  eyebrow = 'Setup Required',
  title,
  description,
  ctaLabel,
  ctaTo,
  footerNote,
}) => {
  return (
    <div className="min-h-screen bg-[#030303] px-6 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-3xl border border-white/10 bg-[#050505]/95 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] md:p-12">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#d4af37]">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-serif text-4xl uppercase tracking-tight text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-8 tracking-wide text-white/60 md:text-base">
          {description}
        </p>

        {ctaLabel && ctaTo ? (
          <Link
            to={ctaTo}
            className="mt-8 inline-flex border border-[#d4af37]/40 px-6 py-4 text-[10px] uppercase tracking-[0.35em] text-[#d4af37] transition-colors duration-300 hover:bg-[#d4af37] hover:text-black"
          >
            {ctaLabel}
          </Link>
        ) : null}

        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/45">
          {footerNote ||
            'Add `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` to your local environment, then reload the app. If you are using the newer Clerk Supabase integration, finish the Supabase-side provider setup as well.'}
        </div>
      </div>
    </div>
  );
};

export default PageNotice;
