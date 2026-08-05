import { createClient } from "@/lib/supabase/client";

export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("xerovolt_profiles")
      .select("role")
      .eq("id", uid)
      .single();

    if (error || !data) return null;
    return data.role ?? null;
  } catch (err) {
    console.error("Error fetching user role:", err);
    return null;
  }
}
