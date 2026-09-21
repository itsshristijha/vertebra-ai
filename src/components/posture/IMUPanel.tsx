"use client";

import { useState } from "react";
import { Battery, CheckCircle2, Radio, RotateCw, Watch, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StateBanner } from "@/components/ui/state-banner";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { getIMUReading } from "@/lib/demo/data";
import { useAppStore } from "@/lib/store/appStore";

export function IMUPanel() {
  const imuStatus = useAppStore((s) => s.imuStatus);
  const setImuStatus = useAppStore((s) => s.setImuStatus);
  const [calibrating, setCalibrating] = useState(false);
  const reading = getIMUReading();

  function connect() {
    setImuStatus("connected");
  }

  function calibrate() {
    setCalibrating(true);
    setTimeout(() => setCalibrating(false), 1200);
  }

  function continueWithCameraOnly() {
    setImuStatus("not-paired");
  }

  const isConnected = imuStatus === "connected";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Wearable IMU</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A single wrist or upper-back inertial measurement unit is optional and adds robustness when the webcam view is
          partially occluded.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-4 w-4" /> Status
          </CardTitle>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              isConnected ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
            }`}
          >
            {isConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isConnected ? "Connected" : "Not connected"}
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          {isConnected ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <ReadingTile label="Pitch" value={`${reading.pitch}°`} />
                <ReadingTile label="Roll" value={`${reading.roll}°`} />
                <ReadingTile label="Yaw" value={`${reading.yaw}°`} />
                <ReadingTile label="Signal Quality" value={reading.signalQuality} icon={<Radio className="h-3.5 w-3.5" />} />
                <ReadingTile label="Battery" value={`${reading.batteryPercent}%`} icon={<Battery className="h-3.5 w-3.5" />} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" onClick={calibrate} disabled={calibrating}>
                  <RotateCw className={calibrating ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Calibrate Sensor
                </Button>
                <Button size="sm" variant="outline" onClick={continueWithCameraOnly}>
                  Disconnect &amp; continue with camera only
                </Button>
              </div>
            </>
          ) : (
            <>
              <StateBanner
                icon={WifiOff}
                title="No wearable connected"
                description="VERTEBRA-AI works from webcam data alone. Connecting an IMU is optional and only adds robustness under occlusion."
              />
              <div className="flex flex-wrap gap-3">
                <Button size="sm" onClick={connect}>
                  <Watch className="h-4 w-4" /> Connect Device
                </Button>
                <Button size="sm" variant="ghost" onClick={continueWithCameraOnly}>
                  Continue With Camera Only
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <RiskDisclaimer compact />
    </div>
  );
}

function ReadingTile({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-1 text-base font-semibold capitalize text-foreground">{value}</p>
    </div>
  );
}
