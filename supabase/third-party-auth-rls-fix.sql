alter table public.reservations
  alter column clerk_user_id set default auth.jwt()->>'sub';

alter table public.contact_messages
  alter column clerk_user_id set default auth.jwt()->>'sub';

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
