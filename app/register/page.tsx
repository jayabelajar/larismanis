import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { RegisterForm } from "@/components/register-form";
import { SiteShell } from "@/components/site-shell";
import { authOptions, googleAuthEnabled } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/account");
  }

  return (
    <SiteShell
      title="Daftar akun"
      description="Buat akun email atau lanjutkan dengan Google. Setup ini sudah cukup untuk alur daftar dan login dasar di MVP."
    >
      <RegisterForm googleEnabled={googleAuthEnabled} />
    </SiteShell>
  );
}
