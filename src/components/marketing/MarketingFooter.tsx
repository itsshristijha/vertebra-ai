import Link from "next/link";
import { Activity } from "lucide-react";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/live-monitor", label: "Live Monitor" },
      { href: "/spine-health", label: "Spine Health Score" },
      { href: "/risk", label: "Risk Outlook" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About / Research" },
      { href: "/privacy", label: "Privacy" },
      { href: "/exercises", label: "Exercise Library" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
      { href: "/settings", label: "Settings" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 text-white">
              <Activity className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-white">VERTEBRA-AI</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            A Health Informatics capstone project. Research and wellness prototype — not a
            diagnostic system.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} VERTEBRA-AI — Health Informatics capstone prototype. Not for clinical use.
      </div>
    </footer>
  );
}
