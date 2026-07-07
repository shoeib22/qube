alter table public.customer_profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_documents enable row level security;
alter table public.device_registry enable row level security;
alter table public.orders enable row level security;
alter table public.panel_configs enable row level security;
alter table public.support_tickets enable row level security;
alter table public.erv_download_leads enable row level security;

-- profiles: self or admin can read; self or admin can update, but a trigger below
-- pins role to its existing value unless the actor is already an admin.
create policy "customer_profiles_select_self_or_admin" on public.customer_profiles
  for select using (id = auth.uid() or public.is_admin(auth.uid()));

create policy "customer_profiles_update_self_or_admin" on public.customer_profiles
  for update using (id = auth.uid() or public.is_admin(auth.uid()));

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin(auth.uid()) then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trigger on public.customer_profiles;
create trigger protect_profile_role_trigger
  before update on public.customer_profiles
  for each row execute procedure public.protect_profile_role();

-- products / product_documents: public read, admin write
create policy "products_public_select" on public.products for select using (true);
create policy "products_admin_write" on public.products for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "product_documents_public_select" on public.product_documents for select using (true);
create policy "product_documents_admin_write" on public.product_documents for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- device_registry: admin only
create policy "device_registry_admin_all" on public.device_registry for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- orders: owner or admin read; authenticated insert of own order; admin-only update
create policy "orders_select_owner_or_admin" on public.orders
  for select using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "orders_insert_own" on public.orders
  for insert with check (user_id = auth.uid());
create policy "orders_update_admin" on public.orders
  for update using (public.is_admin(auth.uid()));

-- panel_configs: owner or admin
create policy "panel_configs_select_owner_or_admin" on public.panel_configs
  for select using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "panel_configs_insert_own" on public.panel_configs
  for insert with check (user_id = auth.uid());
create policy "panel_configs_update_owner_or_admin" on public.panel_configs
  for update using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "panel_configs_delete_owner_or_admin" on public.panel_configs
  for delete using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- support_tickets / erv_download_leads: public insert, admin-only read
create policy "support_tickets_public_insert" on public.support_tickets for insert with check (true);
create policy "support_tickets_admin_select" on public.support_tickets for select using (public.is_admin(auth.uid()));

create policy "erv_leads_public_insert" on public.erv_download_leads for insert with check (true);
create policy "erv_leads_admin_select" on public.erv_download_leads for select using (public.is_admin(auth.uid()));
