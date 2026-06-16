import Link from "next/link";
import { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { Calculator } from "lucide-react";

export async function SiteShell({
  children,
  title = "",
  description = "",
  hideHeader = false,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  hideHeader?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-bgLight text-darkText flex flex-col selection:bg-brutalYellow selection:text-darkText font-sans antialiased overflow-x-hidden">
      <SiteHeader user={user} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 flex-1">
        {!hideHeader && title && (
          <section className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-brutalYellow border-2 border-darkText px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-darkText shadow-brutal-sm transform -rotate-1">
              Seller Pricing Companion
            </span>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-darkText sm:text-4xl md:text-5xl max-w-4xl leading-tight">
                {title}
              </h1>
              {description && (
                <p className="max-w-3xl text-sm font-medium leading-relaxed text-darkText/85 sm:text-base">
                  {description}
                </p>
              )}
            </div>
          </section>
        )}
        
        <div className="w-full">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t-4 border-darkText bg-white pt-16 pb-8 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-brutalRed border-2 border-darkText p-2 rounded-xl shadow-brutal-sm transform -rotate-3">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-3xl text-darkText">LarisManis</span>
          </div>
          
          <div className="flex gap-6 font-bold text-darkText mb-12">
            <Link href="/about" className="hover:text-brutalBlue underline decoration-2 underline-offset-4">Tentang</Link>
            <Link href="/calculator" className="hover:text-brutalBlue underline decoration-2 underline-offset-4">Kalkulator</Link>
            <Link href="/history" className="hover:text-brutalBlue underline decoration-2 underline-offset-4">Riwayat</Link>
            <Link href="/presets" className="hover:text-brutalBlue underline decoration-2 underline-offset-4">Preset Fee</Link>
          </div>

          <div className="w-full border-t-2 border-darkText pt-8 flex justify-center">
            <p className="font-bold text-darkText/60 text-sm">© {new Date().getFullYear()} LarisManis. Made with ❤️ for Sellers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
