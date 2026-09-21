import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Video,
  ClipboardList,
  Crosshair,
  HeartPulse,
  AlertTriangle,
  LineChart,
  Lightbulb,
  Dumbbell,
  FileText,
  ShieldCheck,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Live Monitor", href: "/live-monitor", icon: Video },
  { label: "Assessment", href: "/assessment", icon: ClipboardList },
  { label: "Calibration", href: "/calibration", icon: Crosshair },
  { label: "Spine Health", href: "/spine-health", icon: HeartPulse },
  { label: "Risk Outlook", href: "/risk", icon: AlertTriangle },
  { label: "Trends", href: "/trends", icon: LineChart },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Exercises", href: "/exercises", icon: Dumbbell },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Privacy", href: "/privacy", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];
