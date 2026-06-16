import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/register-form";
import { SiteShell } from "@/components/site-shell";
import { googleAuthEnabled } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Daftar",
  description: "Buat akun LarisManis.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  return (
    <SiteShell
      title="Daftar akun"
      description="Buat akun email atau lanjutkan dengan Google untuk mulai pakai LarisManis."
    >
      <RegisterForm googleEnabled={googleAuthEnabled} />
    </SiteShell>
  );
}
