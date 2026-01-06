import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().role ?? null : null;
  } catch (err) {
    console.error("Error fetching user role:", err);
    return null;
  }
}
