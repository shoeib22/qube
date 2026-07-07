-- raw_user_meta_data is client-controlled at signup time (via the public
-- anon key, potentially bypassing the app's own /api/register route by
-- calling the Supabase Auth REST API directly) — never trust it for role
-- assignment. Every new user is always 'customer'; promotion only happens
-- via the admin/users API route (service role + requireAdmin).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.customer_profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'customer'
  );
  return new;
end;
$$;
