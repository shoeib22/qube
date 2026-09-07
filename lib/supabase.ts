import { createClient, navigatorLock } from "@supabase/supabase-js";

// Browser client — anon key only, RLS governs what it can actually do.
//
// `lock: navigatorLock` makes token refresh coordinate across every tab of
// this site via the Web Locks API instead of each tab running its own
// independent refresh timer. Without it, two tabs sharing the same
// localStorage-persisted refresh token can both try to refresh it around
// the same moment; GoTrue treats the loser's now-stale token as reuse of an
// already-rotated token and revokes the *entire* session (both tabs signed
// out), not just the one that raced. With the lock, only one tab performs
// the actual refresh at a time — others wait, then read the session it just
// wrote instead of racing their own copy of the old token.
//
// This module is also evaluated during Next.js's server-side prerendering
// of "use client" pages (Node has no `navigator`), and supplying *any*
// custom `lock` routes GoTrue's internal init-time bootstrap through it too
// — so passing navigatorLock unconditionally crashes the build. Only use it
// when an actual browser Web Locks API is present; the server/build path
// falls back to no custom lock (GoTrue's lockless single-instance guard).
const lock = typeof window !== "undefined" && typeof navigator !== "undefined" && "locks" in navigator
  ? navigatorLock
  : undefined;

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { lock } }
);

export const waitForAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
