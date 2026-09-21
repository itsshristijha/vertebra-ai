"use client";

import { Bell, Camera, CameraOff, Menu, Radio, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StatusPill } from "./StatusPill";
import { SidebarNav } from "./SidebarNav";
import { useAppStore } from "@/lib/store/appStore";
import { DEMO_USER } from "@/lib/demo/data";
import Link from "next/link";

export function Topbar() {
  const mode = useAppStore((s) => s.mode);
  const toggleMode = useAppStore((s) => s.toggleMode);
  const cameraStatus = useAppStore((s) => s.cameraStatus);
  const imuStatus = useAppStore((s) => s.imuStatus);
  const privacySettings = useAppStore((s) => s.privacySettings);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-navy">
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <StatusPill
          icon={cameraStatus === "connected" ? Camera : CameraOff}
          label={cameraStatus === "connected" ? "Camera connected" : "Camera off"}
          tone={cameraStatus === "connected" ? "good" : "warning"}
          href="/live-monitor"
        />
        <StatusPill
          icon={imuStatus === "connected" ? Wifi : WifiOff}
          label={imuStatus === "connected" ? "IMU connected" : "IMU off"}
          tone={imuStatus === "connected" ? "good" : "neutral"}
          href="/imu"
        />
        <StatusPill
          icon={ShieldCheck}
          label={privacySettings.privacyModeEnabled ? "Privacy protected" : "Privacy off"}
          tone={privacySettings.privacyModeEnabled ? "good" : "warning"}
          href="/privacy"
        />

        <button
          type="button"
          role="switch"
          aria-checked={mode === "live-ai"}
          onClick={toggleMode}
          className="ml-1 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-1 py-1 text-xs font-semibold"
        >
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
              mode === "live-ai" ? "bg-emerald-600 text-white" : "text-muted-foreground"
            }`}
          >
            <Radio className="h-3 w-3" /> Live AI
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
              mode === "demo" ? "bg-indigo-700 text-white" : "text-muted-foreground"
            }`}
          >
            Demo Mode
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="font-medium">Weekly report ready</span>
              <span className="text-xs text-muted-foreground">Your Spine Health trend for last week is in.</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="font-medium">Posture reminder</span>
              <span className="text-xs text-muted-foreground">You&apos;ve been mostly neutral for 2 hours — nice work.</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Manage notification settings</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted" aria-label="Account menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{DEMO_USER.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{DEMO_USER.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/privacy">Privacy</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Sign out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
