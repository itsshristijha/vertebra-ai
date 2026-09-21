import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VERTEBRA-AI — Intelligent Posture & Spine Health Prediction",
    template: "%s · VERTEBRA-AI",
  },
  description:
    "VERTEBRA-AI combines computer vision, personalised baselines and temporal AI to help you understand how your daily posture may influence future spine-health risk. Research and wellness prototype — not a diagnostic system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* reducedMotion="user" makes every Framer Motion animation in the
            app respect prefers-reduced-motion automatically. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
