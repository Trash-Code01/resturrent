export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const CLERK_SUPABASE_JWT_TEMPLATE =
  import.meta.env.VITE_CLERK_SUPABASE_JWT_TEMPLATE ?? '';

export const isClerkConfigured = CLERK_PUBLISHABLE_KEY.length > 0;
export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
export const isClerkSupabaseJwtTemplateConfigured =
  CLERK_SUPABASE_JWT_TEMPLATE.trim().length > 0;

export const isReservationStackConfigured =
  isClerkConfigured && isSupabaseConfigured;
