import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ADMIN_SESSION_COOKIE_NAME } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { getAdminFromSessionValue } from "@/server/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const admin = await getAdminFromSessionValue(
    cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value
  );

  if (!admin) {
    redirect(ROUTES.adminLogin);
  }

  return (
    <main>
      <Container className="py-5 sm:py-8">
        <AdminDashboard admin={admin} />
      </Container>
    </main>
  );
}
