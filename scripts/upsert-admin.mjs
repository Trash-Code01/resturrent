import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const clerkUserId = process.argv[2];
const email = process.argv[3] ?? '';
const fullName = process.argv[4] ?? '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.',
  );
  process.exit(1);
}

if (!clerkUserId) {
  console.error(
    'Usage: node scripts/upsert-admin.mjs <clerk_user_id> [email] [full_name]',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase
  .from('restaurant_admins')
  .upsert(
    {
      clerk_user_id: clerkUserId,
      email,
      full_name: fullName,
    },
    { onConflict: 'clerk_user_id' },
  )
  .select()
  .single();

if (error) {
  console.error('Failed to upsert restaurant admin:', error.message);
  process.exit(1);
}

console.log('Admin upserted successfully.');
console.log(JSON.stringify(data, null, 2));
