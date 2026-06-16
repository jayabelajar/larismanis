import { MarketplaceCalculator } from "@/components/marketplace-calculator";
import { SiteShell } from "@/components/site-shell";

export default function CalculatorPage() {
  return (
    <SiteShell
      title="Kalkulator harga jual"
      description="Hitung harga jual minimal dan harga aman berdasarkan mode online atau offline, fee marketplace atau merchant, voucher seller, dan simulasi harga jual tertentu."
    >
      <MarketplaceCalculator />
    </SiteShell>
  );
}
