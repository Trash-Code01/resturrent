import { createClient } from '@supabase/supabase-js';
import {
  CLERK_SUPABASE_JWT_TEMPLATE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isClerkSupabaseJwtTemplateConfigured,
  isSupabaseConfigured,
} from './env';

let publicClient;

const supabaseClientOptions = {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
};

export function createSupabasePublicClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!publicClient) {
    publicClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      supabaseClientOptions,
    );
  }

  return publicClient;
}

export function buildClerkTokenGetter(getToken) {
  return async () => {
    if (!getToken) {
      return null;
    }

    if (isClerkSupabaseJwtTemplateConfigured) {
      return getToken({ template: CLERK_SUPABASE_JWT_TEMPLATE });
    }

    return getToken();
  };
}

export function createSupabaseAuthedClient(getToken) {
  if (!isSupabaseConfigured) {
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    ...supabaseClientOptions,
    accessToken: buildClerkTokenGetter(getToken),
  });
}
