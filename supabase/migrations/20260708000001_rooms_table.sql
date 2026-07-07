-- Canonical room list for organizing home-automation devices. Previously
-- device_registry.room was free text with no consistency (e.g. "Living Room"
-- vs "living room"); admins manage the list here instead.
create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.rooms enable row level security;

create policy "rooms_admin_all" on public.rooms for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

grant select, insert, update, delete on public.rooms to anon, authenticated, service_role;
