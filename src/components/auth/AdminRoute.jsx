import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PageNotice from '../common/PageNotice';
import {
  isAdminPanelConfigured,
  isSupabaseConfigured,
} from '../../lib/env';
import { hasAdminSession } from '../../lib/adminSession';
import { ADMIN_ACCESS_ROUTE } from '../../lib/routes';

const AdminRoute = ({ children }) => {
  const location = useLocation();

  if (!isAdminPanelConfigured) {
    return (
      <PageNotice
        eyebrow="Back Office Setup"
        title="Admin Credentials Are Not Configured Yet"
        description="Set `VITE_ADMIN_PANEL_EMAIL` and `VITE_ADMIN_PANEL_PASSWORD` in the environment for this build, then reload the back-office route."
        ctaLabel="Back Home"
        ctaTo="/"
        footerNote="Use local `.env` values for development and set the same variables in production. This route now uses the separate admin credentials instead of the guest Clerk login."
      />
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <PageNotice
        eyebrow="Back Office Setup"
        title="Supabase Is Not Connected Yet"
        description="The back-office login is ready, but live reservation and contact management still need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured first."
        ctaLabel="Back Home"
        ctaTo="/"
        footerNote="Once Supabase is connected, the admin workspace can load reservations and contact messages from the production database."
      />
    );
  }

  if (!hasAdminSession()) {
    const redirectPath = `${location.pathname}${location.search}`;

    return (
      <Navigate
        replace
        to={`${ADMIN_ACCESS_ROUTE}?redirect=${encodeURIComponent(redirectPath)}`}
      />
    );
  }

  return children;
};

export default AdminRoute;
