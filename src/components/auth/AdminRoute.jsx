import React from 'react';
import LoadingScreen from '../common/LoadingScreen';
import PageNotice from '../common/PageNotice';
import { isReservationStackConfigured } from '../../lib/env';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { ADMIN_ACCESS_ROUTE } from '../../lib/routes';

const AdminRouteInner = ({ children }) => {
  const { isLoading, isAdmin, error } = useAdminAccess();

  if (isLoading) {
    return <LoadingScreen label="Checking admin access" />;
  }

  if (!isAdmin) {
    return (
      <PageNotice
        eyebrow="Access Restricted"
        title="This Area Is Reserved For Restaurant Admins"
        description={
          error ||
          'Your account is signed in, but it is not listed in the restaurant admin table yet.'
        }
        ctaLabel="Use Admin Access"
        ctaTo={ADMIN_ACCESS_ROUTE}
        footerNote="Use the separate back-office access route to switch accounts, or ask the owner to add this Clerk user to the `restaurant_admins` table."
      />
    );
  }

  return children;
};

const AdminRoute = ({ children }) => {
  if (!isReservationStackConfigured) {
    return (
      <PageNotice
        title="Admin Tools Need Clerk And Supabase Connected"
        description="The admin panel is ready in code, but live reservation and contact management need the Clerk and Supabase integration to be fully connected first."
        ctaLabel="Back Home"
        ctaTo="/"
      />
    );
  }

  return <AdminRouteInner>{children}</AdminRouteInner>;
};

export default AdminRoute;
