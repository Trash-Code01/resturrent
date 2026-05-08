import React from 'react';
import { SignIn } from '@clerk/react';
import { useSearchParams, Link } from 'react-router-dom';
import PageNotice from '../components/common/PageNotice';
import { isClerkConfigured } from '../lib/env';
import { clerkSplitAppearance } from '../lib/clerkAppearance';

const SignInPage = () => {
  const [searchParams] = useSearchParams();

  if (!isClerkConfigured) {
    return (
      <PageNotice
        title="Clerk Is Not Configured Yet"
        description="The sign-in page is wired up, but it will stay inactive until you provide the Clerk publishable key."
        ctaLabel="Back Home"
        ctaTo="/"
      />
    );
  }

  const redirectTo = searchParams.get('redirect') || '/my-account';
  const signUpUrl = `/sign-up?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <div className="flex min-h-[100svh] w-full bg-[#050607]">
      <div className="relative hidden overflow-hidden border-r border-white/5 lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-16">
        <div className="absolute inset-0">
          <img
            src="/asset/our story/image 2.png"
            alt="Obsidian Dining"
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
            Welcome Back
          </p>
          <h2 className="mb-6 font-serif text-[2.8rem] leading-[1.1] tracking-tight text-white">
            A Legacy of Fire, Gold, and Silence.
          </h2>
          <p className="text-sm font-sans leading-relaxed tracking-wide text-white/50">
            Enter your private portal to manage reservations, curate your dining experience, and
            explore our exclusive pre-order menus.
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-x-hidden overflow-y-auto p-4 sm:p-12">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-full max-w-[500px] -translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-[120px]" />

        <div className="relative z-10 w-full max-w-[480px] rounded-[28px] border border-[#d4af37]/20 bg-[#0c0c0a]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-12">
          <Link
            to="/"
            className="mb-8 block text-center font-serif text-2xl uppercase tracking-[0.25em] text-white transition-colors hover:text-[#d4af37] lg:hidden"
          >
            Obsidian
          </Link>

          <div className="mb-8 text-center">
            <h2 className="mb-3 font-serif text-[2rem] leading-tight tracking-wide text-white md:text-[2.6rem]">
              Welcome Guest
            </h2>
            <p className="text-xs font-light tracking-wide text-white/50 sm:text-sm">
              Sign in to manage your reservations and curate your evening.
            </p>
          </div>

          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl={signUpUrl}
            forceRedirectUrl={redirectTo}
            fallbackRedirectUrl="/my-account"
            appearance={clerkSplitAppearance}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
