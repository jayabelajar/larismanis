import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LoginForm } from "@/components/login-form";
import { SiteShell } from "@/components/site-shell";
import { authOptions, googleAuthEnabled } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/account");
  }

  return (
    <SiteShell
      title="Login akun"
      description="Masuk ke akun LarisManis untuk menyimpan identitas pengguna dan melanjutkan workflow seller."
    >
      <LoginForm googleEnabled={googleAuthEnabled} />
    </SiteShell>
  );
}
