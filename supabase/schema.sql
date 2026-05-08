create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.restaurant_admins (
  clerk_user_id text primary key,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  confirmation_code text not null unique,
  reservation_date date not null,
  reservation_time text not null,
  guest_label text not null,
  seating text not null,
  experience text not null,
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  special_requests text,
  reservation_status text not null default 'pending',
  table_number text,
  admin_notes text,
  subtotal numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_status_check
    check (reservation_status in ('pending', 'confirmed', 'preparing', 'completed', 'cancelled'))
);

create table if not exists public.reservation_preorders (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  menu_item_id text not null,
  menu_item_name text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text,
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_messages_status_check
    check (status in ('new', 'in_progress', 'resolved'))
);

alter table public.reservations
  alter column clerk_user_id set default auth.jwt()->>'sub';

alter table public.contact_messages
  alter column clerk_user_id set default auth.jwt()->>'sub';

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
before update on public.reservations
for each row
execute function public.set_updated_at();

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row
execute function public.set_updated_at();

alter table public.restaurant_admins enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_preorders enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "admins can view themselves" on public.restaurant_admins;
create policy "admins can view themselves"
on public.restaurant_admins
for select
to anon, authenticated
using (clerk_user_id = auth.jwt()->>'sub');

drop policy if exists "users can create their reservations" on public.reservations;
create policy "users can create their reservations"
on public.reservations
for insert
to anon, authenticated
with check (clerk_user_id = auth.jwt()->>'sub');

drop policy if exists "users can view their reservations" on public.reservations;
create policy "users can view their reservations"
on public.reservations
for select
to anon, authenticated
using (
  clerk_user_id = auth.jwt()->>'sub'
  or exists (
    select 1
    from public.restaurant_admins admins
    where admins.clerk_user_id = auth.jwt()->>'sub'
  )
);

drop policy if exists "users can update their reservations" on public.reservations;
create policy "users can update their reservations"
on public.reservations
for update
to anon, authenticated
using (
  clerk_user_id = auth.jwt()->>'sub'
  or exists (
    select 1
    from public.restaurant_admins admins
    where admins.clerk_user_id = auth.jwt()->>'sub'
  )
)
with check (
  clerk_user_id = auth.jwt()->>'sub'
  or exists (
    select 1
    from public.restaurant_admins admins
    where admins.clerk_user_id = auth.jwt()->>'sub'
  )
);

drop policy if exists "users and admins can view reservation items" on public.reservation_preorders;
create policy "users and admins can view reservation items"
on public.reservation_preorders
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.reservations reservations
    where reservations.id = reservation_preorders.reservation_id
      and (
        reservations.clerk_user_id = auth.jwt()->>'sub'
        or exists (
          select 1
          from public.restaurant_admins admins
          where admins.clerk_user_id = auth.jwt()->>'sub'
        )
      )
  )
);

drop policy if exists "users can create reservation items" on public.reservation_preorders;
create policy "users can create reservation items"
on public.reservation_preorders
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.reservations reservations
    where reservations.id = reservation_preorders.reservation_id
      and reservations.clerk_user_id = auth.jwt()->>'sub'
  )
);

drop policy if exists "guests can submit contact messages" on public.contact_messages;
create policy "guests can submit contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can review contact messages" on public.contact_messages;
create policy "admins can review contact messages"
on public.contact_messages
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.restaurant_admins admins
    where admins.clerk_user_id = auth.jwt()->>'sub'
  )
);

drop policy if exists "admins can update contact messages" on public.contact_messages;
create policy "admins can update contact messages"
on public.contact_messages
for update
to anon, authenticated
using (
  exists (
    select 1
    from public.restaurant_admins admins
    where admins.clerk_user_id = auth.jwt()->>'sub'
  )
)
with check (
  exists (
    select 1
    from public.restaurant_admins admins
    where admins.clerk_user_id = auth.jwt()->>'sub'
  )
);
