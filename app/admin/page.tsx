import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE, listSubmissions } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await cookies();
  const session = verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  const submissions = await listSubmissions();
  return <AdminDashboard initial={submissions} email={session.email} />;
}
