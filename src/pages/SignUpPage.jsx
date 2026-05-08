import React from 'react';
import { SignUp } from '@clerk/react';
import { useSearchParams, Link } from 'react-router-dom';
import PageNotice from '../components/common/PageNotice';
import { isClerkConfigured } from '../lib/env';
import { clerkSplitAppearance } from '../lib/clerkAppearance';

const SignUpPage = () => {
  const [searchParams] = useSearchParams();

  if (!isClerkConfigured) {
    return (
      <PageNotice
        title="Clerk Is Not Configured Yet"
        description="The sign-up page is ready, but it needs the Clerk publishable key before new guests can create accounts."
        ctaLabel="Back Home"
        ctaTo="/"
      />
    );
  }

  const redirectTo = searchParams.get('redirect') || '/my-account';
  const signInUrl = `/sign-in?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <div className="flex min-h-[100svh] w-full bg-[#050607]">
      <div className="relative hidden overflow-hidden border-r border-white/5 lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-16">
        <div className="absolute inset-0">
          <img
            src="/asset/our story/place4.png"
            alt="Obsidian Experience"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link
            to="/"
            className="font-serif text-3xl uppercase tracking-[0.25em] text-white transition-colors hover:text-[#d4af37]"
          >
            Obsidian
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">
            Join The Legacy
          </p>
          <h2 className="mb-6 font-serif text-[2.8rem] leading-[1.1] tracking-tight text-white">
            Elevate Your Evening.
          </h2>
          <p className="text-sm font-sans leading-relaxed tracking-wide text-white/50">
            Create an account to secure priority reservations, save your dining preferences, and
            gain access to our chef&apos;s exclusive seasonal previews.
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-x-hidden overflow-y-auto p-4 sm:p-12">
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-full max-w-[400px] rounded-full bg-[#d4af37]/5 blur-[120px]" />

        <div className="relative z-10 w-full max-w-[480px] rounded-[28px] border border-[#d4af37]/20 bg-[#0c0c0a]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-12">
          <Link
            to="/"
            className="mb-8 block text-center font-serif text-2xl uppercase tracking-[0.25em] text-white transition-colors hover:text-[#d4af37] lg:hidden"
          >
            Obsidian
          </Link>

          <div className="mb-8 text-center">
            <h2 className="mb-3 font-serif text-[2rem] leading-tight tracking-wide text-white md:text-[2.6rem]">
              Create Account
            </h2>
            <p className="text-xs font-light tracking-wide text-white/50 sm:text-sm">
              Join to secure priority reservations and explore seasonal menus.
            </p>
          </div>

          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl={signInUrl}
            forceRedirectUrl={redirectTo}
            fallbackRedirectUrl="/my-account"
            appearance={clerkSplitAppearance}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
