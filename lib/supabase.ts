import { createClient } from "@supabase/supabase-js";

// Browser client — anon key only, RLS governs what it can actually do.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const waitForAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
