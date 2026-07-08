create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.addresses (user_id);

alter table public.addresses enable row level security;

create policy "addresses_select_owner_or_admin" on public.addresses
  for select using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "addresses_insert_own" on public.addresses
  for insert with check (user_id = auth.uid());
create policy "addresses_update_owner_or_admin" on public.addresses
  for update using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "addresses_delete_owner_or_admin" on public.addresses
  for delete using (user_id = auth.uid() or public.is_admin(auth.uid()));

grant select, insert, update, delete on public.addresses to anon, authenticated, service_role;
