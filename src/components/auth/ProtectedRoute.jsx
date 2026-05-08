import React from 'react';
import { useAuth } from '@clerk/react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingScreen from '../common/LoadingScreen';
import PageNotice from '../common/PageNotice';
import { isClerkConfigured } from '../../lib/env';

const ProtectedRoute = ({ children, signInPath = '/sign-in' }) => {
  if (!isClerkConfigured) {
    return (
      <PageNotice
        title="Authentication Has Not Been Connected Yet"
        description="This private area depends on Clerk. Once you share the Clerk publishable key, the sign-in flow and user dashboard will become active."
        ctaLabel="Back Home"
        ctaTo="/"
      />
    );
  }

  const ProtectedRouteContent = () => {
    const location = useLocation();
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
      return <LoadingScreen label="Loading your account" />;
    }

    if (!isSignedIn) {
      const redirectPath = `${location.pathname}${location.search}`;
      return (
        <Navigate
          replace
          to={`${signInPath}?redirect=${encodeURIComponent(redirectPath)}`}
        />
      );
    }

    return children || <Outlet />;
  };

  return <ProtectedRouteContent />;
};

export default ProtectedRoute;
