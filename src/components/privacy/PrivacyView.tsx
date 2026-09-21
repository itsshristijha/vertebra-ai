"use client";

import { useState } from "react";
import { Database, Lock, Pause, ServerCog, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { useAppStore } from "@/lib/store/appStore";

const CARDS = [
  { icon: ServerCog, title: "Local Processing", body: "Pose processing can happen on-device." },
  { icon: Database, title: "Minimal Data", body: "Posture features are preferred over raw video storage." },
  { icon: Lock, title: "Secure Storage", body: "Sensitive information should be encrypted." },
  { icon: UserCog, title: "User Control", body: "Pause monitoring and delete stored data at any time." },
];

export function PrivacyView() {
  const privacySettings = useAppStore((s) => s.privacySettings);
  const updatePrivacySettings = useAppStore((s) => s.updatePrivacySettings);
  const setHasCalibratedBaseline = useAppStore((s) => s.setHasCalibratedBaseline);
  const [paused, setPaused] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your posture data stays yours.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Privacy-first design, with full control over what&apos;s stored.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
          <ShieldCheck className={privacySettings.privacyModeEnabled ? "h-4 w-4 text-emerald-600" : "h-4 w-4 text-muted-foreground"} />
          <span className="text-xs font-semibold">Privacy Mode: {privacySettings.privacyModeEnabled ? "ON" : "OFF"}</span>
          <Switch checked={privacySettings.privacyModeEnabled} onCheckedChange={(v) => updatePrivacySettings({ privacyModeEnabled: v })} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Card key={c.title}>
            <CardContent className="flex items-start gap-3 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{c.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Row label="Local processing only" description="Keep pose inference on-device rather than sending frames to a server.">
            <Switch checked={privacySettings.localProcessingOnly} onCheckedChange={(v) => updatePrivacySettings({ localProcessingOnly: v })} />
          </Row>
          <Row label="Store raw video" description="Off by default — posture features are stored instead of raw frames.">
            <Switch checked={privacySettings.storeRawVideo} onCheckedChange={(v) => updatePrivacySettings({ storeRawVideo: v })} />
          </Row>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => setPaused((p) => !p)}>
              <Pause className="h-4 w-4" /> {paused ? "Resume monitoring" : "Pause monitoring"}
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" /> Delete stored data
            </Button>
          </div>
          {paused && <p className="text-xs font-medium text-amber-700">Monitoring paused — no new posture data will be recorded.</p>}
          {deleted && <p className="text-xs font-medium text-emerald-700">Stored demo data cleared.</p>}
        </CardContent>
      </Card>

      <RiskDisclaimer />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete stored data?</DialogTitle>
            <DialogDescription>
              This removes locally stored posture sessions and reports from this device. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleted(true);
                setDeleteOpen(false);
                // Clearing stored data also clears the personal baseline and
                // historical trend/report data — Trends and Reports fall
                // back to their "no historical data" state until you
                // calibrate again.
                setHasCalibratedBaseline(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
