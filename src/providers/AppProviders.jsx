import React from 'react';
import { ClerkProvider } from '@clerk/react';
import { clerkAppearance } from '../lib/clerkAppearance';
import {
  CLERK_PUBLISHABLE_KEY,
  isClerkConfigured,
} from '../lib/env';

const AppProviders = ({ children }) => {
  if (!isClerkConfigured) {
    return children;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
};

export default AppProviders;
