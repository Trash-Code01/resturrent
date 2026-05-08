import React, { useEffect, useState } from 'react';
import { useAuth, useClerk, useSignIn, useUser } from '@clerk/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import LoadingScreen from '../components/common/LoadingScreen';
import PageNotice from '../components/common/PageNotice';
import { useAdminAccess } from '../hooks/useAdminAccess';
import { isClerkConfigured } from '../lib/env';
import { ADMIN_ACCESS_ROUTE, ADMIN_PANEL_ROUTE } from '../lib/routes';

const DEV_ADMIN_EMAIL = 'testdev@.com';
const DEV_ADMIN_PASSWORD = 'password';

function getClerkErrorMessage(error) {
  const firstError = error?.errors?.[0];

  return (
    firstError?.longMessage ||
    firstError?.message ||
    error?.message ||
    'Admin sign-in could not be completed. Check the credentials and try again.'
  );
}

const CredentialTile = ({ label, value }) => (
  <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-4">
    <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
      {label}
    </p>
    <p className="mt-2 break-all text-sm font-medium text-white/82">{value}</p>
  </div>
);

const AdminAccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { setActive, signOut } = useClerk();
  const { user } = useUser();
  const { isLoading: isAdminLoading, isAdmin } = useAdminAccess();
  const [formData, setFormData] = useState({
    email: DEV_ADMIN_EMAIL,
    password: DEV_ADMIN_PASSWORD,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

  const redirectTo = searchParams.get('redirect') || ADMIN_PANEL_ROUTE;
  const signedInEmail =
    user?.primaryEmailAddress?.emailAddress || user?.username || 'Current account';

  useEffect(() => {
    if (!authLoaded) {
      return;
    }

    if (isSignedIn && !isAdminLoading && isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoaded, isAdmin, isAdminLoading, isSignedIn, navigate, redirectTo]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!signInLoaded || !signIn || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const result = await signIn.create({
        strategy: 'password',
        identifier: formData.email.trim(),
        password: formData.password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        navigate(redirectTo, { replace: true });
        return;
      }

      setError(
        'This sign-in needs an extra verification step. Finish it in Clerk or switch the admin account to a direct email-password login.',
      );
    } catch (signInError) {
      console.error('Admin access sign-in failed:', signInError);
      setError(getClerkErrorMessage(signInError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSwitchAccount() {
    if (isSwitchingAccount) {
      return;
    }

    try {
      setIsSwitchingAccount(true);
      await signOut({
        redirectUrl: `${ADMIN_ACCESS_ROUTE}?redirect=${encodeURIComponent(
          redirectTo,
        )}`,
      });
    } catch (signOutError) {
      console.error('Failed to sign out from admin access page:', signOutError);
      setIsSwitchingAccount(false);
    }
  }

  if (!isClerkConfigured) {
    return (
      <PageNotice
        title="Back Office Access Needs Clerk"
        description="The separate admin login route is ready, but it depends on Clerk before the back-office account can sign in."
        ctaLabel="Back Home"
        ctaTo="/"
      />
    );
  }

  if (!authLoaded || !signInLoaded || (isSignedIn && isAdminLoading)) {
    return <LoadingScreen label="Preparing back-office access" />;
  }

  if (isSignedIn && !isAdmin) {
    return (
      <AuthShell
        eyebrow="Back Office Access"
        title="This Account Is Not Approved"
        description="The admin panel uses a separate back-office route and a separate admin account. Sign out of the current guest session to continue with the dedicated admin credentials."
        panelEyebrow="Account Switch Required"
        panelTitle="Current Session Cannot Open Back Office"
        panelDescription="Use the dedicated admin account instead of a guest dining account when entering the operations panel."
      >
        <div className="space-y-5">
          <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8a75e]">
              Signed In As
            </p>
            <p className="mt-3 text-base font-medium text-white">{signedInEmail}</p>
            <p className="mt-3 text-sm leading-7 text-white/58">
              This session is not listed in the restaurant admin table, so it
              cannot access the back-office workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CredentialTile label="Admin Email" value={DEV_ADMIN_EMAIL} />
            <CredentialTile label="Admin Password" value={DEV_ADMIN_PASSWORD} />
          </div>

          {error ? (
            <div className="rounded-[16px] border border-rose-400/20 bg-rose-400/10 px-4 py-4 text-sm leading-7 text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSwitchAccount}
              disabled={isSwitchingAccount}
              className="inline-flex items-center justify-center rounded-[14px] border border-[#c8a75e]/28 bg-[#c8a75e]/10 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-[#e3c981] transition-colors duration-300 hover:bg-[#c8a75e] hover:text-black disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSwitchingAccount ? 'Signing Out' : 'Use Admin Account'}
            </button>
            <Link
              to="/my-account"
              className="inline-flex items-center justify-center rounded-[14px] border border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white/68 transition-colors duration-300 hover:border-white/24 hover:text-white"
            >
              Go To My Account
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Back Office Access"
      title="Admin Control Login"
      description="Enter the separate operations workspace for reservations, contact requests, and live service management. This route is reserved for restaurant staff only."
      panelEyebrow="Admin Sign In"
      panelTitle="Use The Dedicated Back-Office Account"
      panelDescription="Email and password access is isolated here so the public guest login and the admin workspace stay clearly separated."
    >
      <div className="space-y-5">
        <div className="rounded-[18px] border border-[#c8a75e]/18 bg-[#c8a75e]/8 p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8a75e]">
            Dev Credentials
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <CredentialTile label="Admin Email" value={DEV_ADMIN_EMAIL} />
            <CredentialTile label="Password" value={DEV_ADMIN_PASSWORD} />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/56">
            These are temporary development credentials. The same account must
            also exist inside Clerk and be listed in the restaurant admin table.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.28em] text-white/38">
              Admin Email
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(event) =>
                setFormData((currentData) => ({
                  ...currentData,
                  email: event.target.value,
                }))
              }
              className="mt-3 w-full rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none placeholder:text-white/24"
              placeholder="Admin email"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.28em] text-white/38">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(event) =>
                setFormData((currentData) => ({
                  ...currentData,
                  password: event.target.value,
                }))
              }
              className="mt-3 w-full rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none placeholder:text-white/24"
              placeholder="Admin password"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-[16px] border border-rose-400/20 bg-rose-400/10 px-4 py-4 text-sm leading-7 text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[210px] items-center justify-center rounded-[14px] border border-[#c8a75e]/28 bg-[#c8a75e]/10 px-5 py-4 text-[11px] uppercase tracking-[0.24em] text-[#e3c981] transition-colors duration-300 hover:bg-[#c8a75e] hover:text-black disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSubmitting ? 'Opening Back Office' : 'Enter Back Office'}
            </button>
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-[14px] border border-white/10 px-5 py-4 text-[11px] uppercase tracking-[0.24em] text-white/68 transition-colors duration-300 hover:border-white/24 hover:text-white"
            >
              Guest Login
            </Link>
          </div>
        </form>
      </div>
    </AuthShell>
  );
};

export default AdminAccessPage;
