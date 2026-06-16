import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { SiteShell } from "@/components/site-shell";
import { googleAuthEnabled } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Login",
  description: "Masuk ke akun LarisManis.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
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
