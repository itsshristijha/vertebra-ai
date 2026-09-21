import { ExternalLink, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskCondition } from "@/types/risk";

type Equipment = {
  name: string;
  why: string;
  conditions: RiskCondition[];
  search: string;
};

const EQUIPMENT: Equipment[] = [
  { name: "Non-slip yoga mat", why: "A stable surface for mobility and floor exercises.", conditions: ["forward-head-posture", "thoracic-hyperkyphosis", "non-specific-low-back-pain"], search: "non slip yoga mat exercise" },
  { name: "Lumbar support cushion", why: "May make longer seated sessions more comfortable.", conditions: ["non-specific-low-back-pain"], search: "ergonomic lumbar support cushion chair" },
  { name: "Yoga bolster or firm cushion", why: "Useful for supported chest opening and gentle mobility.", conditions: ["forward-head-posture", "thoracic-hyperkyphosis"], search: "yoga bolster firm support cushion" },
  { name: "Foam roller", why: "A mobility accessory for controlled upper-back work.", conditions: ["thoracic-hyperkyphosis", "forward-head-posture"], search: "foam roller physical therapy" },
];

const CONDITION_LABELS: Record<RiskCondition, string> = {
  "forward-head-posture": "Forward-head posture",
  "thoracic-hyperkyphosis": "Upper-back posture",
  "non-specific-low-back-pain": "Lower-back comfort",
};

function marketplaceUrl(marketplace: "amazon" | "flipkart", search: string) {
  return marketplace === "amazon"
    ? `https://www.amazon.in/s?k=${encodeURIComponent(search)}`
    : `https://www.flipkart.com/search?q=${encodeURIComponent(search)}`;
}

export function EquipmentShop() {
  return (
    <Card className="overflow-hidden border-slate-200/80">
      <CardHeader className="border-b border-border bg-gradient-to-r from-slate-50 to-teal-50/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg"><ShoppingBag className="h-5 w-5 text-teal-600" /> Equipment shop</CardTitle>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Simple accessories matched to the posture pattern you may want to work on.</p>
          </div>
          <span className="hidden rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 shadow-sm sm:inline-flex">External stores</span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
        {EQUIPMENT.map((item) => (
          <div key={item.name} className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.why}</p>
              </div>
              <ShoppingBag className="h-4 w-4 shrink-0 text-teal-600" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.conditions.map((condition) => <span key={condition} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">{CONDITION_LABELS[condition]}</span>)}
            </div>
            <div className="mt-4 flex gap-2">
              <a className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#ff9900] px-2.5 text-xs font-semibold text-white hover:opacity-90" href={marketplaceUrl("amazon", item.search)} target="_blank" rel="noreferrer">
                Amazon <ExternalLink className="h-3 w-3" />
              </a>
              <a className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#2874f0] px-2.5 text-xs font-semibold text-white hover:opacity-90" href={marketplaceUrl("flipkart", item.search)} target="_blank" rel="noreferrer">
                Flipkart <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Listings and prices are controlled by the retailers. Choose equipment that feels comfortable and stop if it causes pain.</div>
    </Card>
  );
}