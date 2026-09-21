"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoseSkeleton, STATIC_DEMO_LANDMARKS } from "@/components/posture/PoseSkeleton";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 10%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(50% 40% at 85% 20%, rgba(45,212,191,0.25) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            AI in Healthcare · Health Informatics Capstone
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Understand Your Posture.
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Predict Your Spine Health.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            VERTEBRA-AI combines computer vision, personalised baselines and temporal AI to help you understand how
            your daily posture may influence future spine-health risk.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Posture Assessment <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/#how-it-works">
                <PlayCircle className="h-4 w-4" /> Explore How It Works
              </Link>
            </Button>
          </div>
          <p className="mt-6 max-w-md text-xs text-slate-500">
            Research and wellness prototype. VERTEBRA-AI does not diagnose spinal disorders or replace professional
            medical assessment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative aspect-[4/5] rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-4 shadow-2xl backdrop-blur">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-navy-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3/4 w-3/4 rounded-2xl border border-dashed border-white/15" />
              </div>
              <PoseSkeleton landmarks={STATIC_DEMO_LANDMARKS} className="absolute inset-0 h-full w-full" highlightColor="#5eead4" />
              <div className="absolute left-3 top-3">
                <DemoDataBadge />
              </div>
            </div>

            <motion.div
              className="absolute -left-8 top-10 w-44 rounded-2xl border border-white/10 bg-white p-3 text-navy shadow-xl animate-[float_6s_ease-in-out_infinite]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-[11px] font-medium text-slate-500">Spine Health Score</p>
              <p className="text-2xl font-semibold">82<span className="text-sm text-slate-400"> /100</span></p>
              <p className="mt-0.5 text-[10px] text-slate-400">Demo values</p>
            </motion.div>

            <motion.div
              className="absolute -right-6 top-1/2 w-40 -translate-y-1/2 rounded-2xl border border-white/10 bg-white p-3 text-navy shadow-xl"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              style={{ animation: "float 6s ease-in-out infinite", animationDelay: "1.5s" }}
            >
              <p className="text-[11px] font-medium text-slate-500">Postural Load</p>
              <p className="text-xl font-semibold text-emerald-600">Low</p>
              <p className="mt-0.5 text-[10px] text-slate-400">Demo values</p>
            </motion.div>

            <motion.div
              className="absolute -bottom-6 left-8 w-44 rounded-2xl border border-white/10 bg-white p-3 text-navy shadow-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{ animation: "float 6s ease-in-out infinite", animationDelay: "0.8s" }}
            >
              <p className="text-[11px] font-medium text-slate-500">Head Alignment</p>
              <p className="text-xl font-semibold text-indigo-600">Good</p>
              <p className="mt-0.5 text-[10px] text-slate-400">Demo values</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
