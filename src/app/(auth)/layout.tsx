import Link from "next/link";
import { Activity } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-navy px-8 py-10 text-white sm:px-14 sm:py-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400">
            <Activity className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold">VERTEBRA-AI</span>
        </Link>
        <div className="hidden max-w-md lg:block">
          <h2 className="text-3xl font-semibold leading-tight">
            Understand your posture. Predict your spine health.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Personalised baselines, temporal AI and clinically-linked indices — delivered as a privacy-first, research
            and wellness prototype.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          VERTEBRA-AI is a research and wellness prototype. It does not diagnose spinal disorders or replace
          professional medical assessment.
        </p>
      </div>
      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
