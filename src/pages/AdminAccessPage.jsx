import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import PageNotice from '../components/common/PageNotice';
import {
  hasAdminSession,
  isAdminCredentialMatch,
  persistAdminSession,
} from '../lib/adminSession';
import { isAdminPanelConfigured } from '../lib/env';
import { ADMIN_PANEL_ROUTE } from '../lib/routes';

const AdminAccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirect') || ADMIN_PANEL_ROUTE;

  useEffect(() => {
    if (hasAdminSession()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    if (!isAdminCredentialMatch(formData.email, formData.password)) {
      setError(
        'The back-office email or password is incorrect. Check the environment-backed admin credentials and try again.',
      );
      setIsSubmitting(false);
      return;
    }

    persistAdminSession(formData.email);
    navigate(redirectTo, { replace: true });
  }

  if (!isAdminPanelConfigured) {
    return (
      <PageNotice
        eyebrow="Back Office Setup"
        title="Admin Credentials Are Missing"
        description="Add `VITE_ADMIN_PANEL_EMAIL` and `VITE_ADMIN_PANEL_PASSWORD` to the environment for this build so the separate back-office login can verify staff access."
        ctaLabel="Back Home"
        ctaTo="/"
        footerNote="Set the same variables in production to keep the admin route separate from the public guest login. This route no longer depends on Clerk."
      />
    );
  }

  return (
    <AuthShell
      eyebrow="Back Office Access"
      title="Admin Control Login"
      description="Enter the separate operations workspace for reservations, contact requests, and live service management. This route uses dedicated environment-backed staff credentials."
    >
      <div className="space-y-5">
        <div className="rounded-[18px] border border-[#c8a75e]/18 bg-[#c8a75e]/8 p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8a75e]">
            Separate Staff Access
          </p>
          <p className="mt-3 text-sm leading-7 text-white/58">
            This back-office route is now isolated from the public guest login.
            Use the admin email and password defined in the environment for this
            build.
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
