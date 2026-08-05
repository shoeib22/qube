import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./env";

/**
 * Supabase client for Client Components / the browser. Uses the public anon key —
 * safe to expose, since it's subject to Row Level Security.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey());
}

/**
 * Current session's access token, for attaching to `Authorization: Bearer` headers on
 * fetch() calls to our own API routes — the equivalent of Firebase's
 * `auth.currentUser?.getIdToken()`.
 */
export async function getAccessToken(): Promise<string | undefined> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}
