import { PresetsClient } from "@/components/presets-client";
import { SiteShell } from "@/components/site-shell";

export default function PresetsPage() {
  return (
    <SiteShell
      title="Preset fee marketplace"
      description="Atur nilai default admin fee, service fee, ads, affiliate, dan biaya tetap untuk tiap marketplace. Nilai ini akan otomatis terpakai di kalkulator."
    >
      <PresetsClient />
    </SiteShell>
  );
}
