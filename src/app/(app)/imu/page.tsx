import type { Metadata } from "next";
import { IMUPanel } from "@/components/posture/IMUPanel";

export const metadata: Metadata = { title: "Wearable IMU" };

export default function IMUPage() {
  return <IMUPanel />;
}
