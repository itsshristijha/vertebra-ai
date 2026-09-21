import type { Metadata } from "next";
import { CalibrationFlow } from "@/components/calibration/CalibrationFlow";

export const metadata: Metadata = { title: "Calibration" };

export default function CalibrationPage() {
  return <CalibrationFlow />;
}
