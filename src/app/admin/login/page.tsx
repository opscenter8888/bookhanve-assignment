import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ADMIN_SESSION_COOKIE_NAME } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { AdminLoginForm } from "@/features/admin/AdminLoginForm";
import { getAdminFromSessionValue } from "@/server/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const admin = await getAdminFromSessionValue(
    cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value
  );

  if (admin) {
    redirect(ROUTES.admin);
  }

  return (
    <main>
      <Container className="py-10 sm:py-14">
        <AdminLoginForm />
      </Container>
    </main>
  );
}
