-- Tables created via a plain `postgres`-owned migration don't automatically
-- get anon/authenticated/service_role privileges the way supabase_admin's
-- default ACL does — RLS governs *rows*, but object-level GRANTs are a
-- separate, orthogonal permission layer that must be set explicitly.
grant select, insert, update, delete on
  public.customer_profiles,
  public.products,
  public.product_documents,
  public.device_registry,
  public.orders,
  public.panel_configs,
  public.support_tickets,
  public.erv_download_leads
to anon, authenticated, service_role;
