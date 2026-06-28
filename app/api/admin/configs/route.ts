import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { db, auth } from "@/lib/firebaseAdmin";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const snap = await db.collection("panelConfigs").orderBy("savedAt", "desc").limit(100).get();
  const configs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Batch-resolve user emails
  const userIds = [...new Set(configs.map((c: any) => c.userId).filter(Boolean))];
  const emailMap: Record<string, string> = {};
  if (auth && userIds.length > 0) {
    await Promise.all(
      userIds.map(async uid => {
        try {
          const u = await auth!.getUser(uid as string);
          emailMap[uid as string] = u.email ?? uid as string;
        } catch {
          emailMap[uid as string] = uid as string;
        }
      })
    );
  }

  const enriched = configs.map((c: any) => ({ ...c, userEmail: emailMap[c.userId] ?? c.userId }));

  return Response.json({ configs: enriched });
}
