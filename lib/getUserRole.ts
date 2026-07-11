import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared `customer_profiles` lookup used by both server-side auth
 * (lib/auth-middleware.ts) and client-side auth state (context/AuthContext.tsx,
 * components/auth/RequireAuth.tsx) so the query/error handling lives in one
 * place regardless of which Supabase client (admin or browser) is calling it.
 */
export async function getCustomerProfile<T extends string>(
  client: SupabaseClient,
  userId: string,
  select: T,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await client
    .from("customer_profiles")
    .select(select)
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as unknown as Record<string, unknown>;
}

export async function getUserRole(client: SupabaseClient, userId: string): Promise<string | null> {
  const profile = await getCustomerProfile(client, userId, "role");
  return (profile?.role as string | undefined) ?? null;
}
