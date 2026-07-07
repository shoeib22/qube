-- These are trigger-only functions, not meant to be called directly via
-- PostgREST RPC. Triggers fire regardless of these grants.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.protect_profile_role() from public;

-- Allow the service_role (trusted backend API routes, already gated by
-- requireAdmin at the application layer) to change a profile's role even
-- though it has no auth.uid() session context.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.role() <> 'service_role'
     and not public.is_admin(auth.uid()) then
    new.role := old.role;
  end if;
  return new;
end;
$$;
