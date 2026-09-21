import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-600 px-8 py-16 text-center text-white sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(40% 60% at 50% 0%, white 0%, transparent 60%)" }}
        />
        <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
          Start understanding your posture today.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-indigo-100">
          Try the interactive Demo Mode dashboard — no webcam or wearable required — and see how VERTEBRA-AI turns
          everyday posture into a longitudinal spine-health signal.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" className="bg-white text-indigo-700 hover:bg-white/90" asChild>
            <Link href="/signup">
              Start Posture Assessment <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
            <Link href="/dashboard">View Demo Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
