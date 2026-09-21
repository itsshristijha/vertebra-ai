"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, CheckCircle2, RotateCcw, ScanLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PoseSkeleton, STATIC_DEMO_LANDMARKS } from "@/components/posture/PoseSkeleton";
import { BlazePoseProvider } from "@/lib/mediapipe";
import type { PoseLandmarks } from "@/types/posture";

type View = "front" | "side";

export function AssessmentCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const providerRef = useRef<BlazePoseProvider | null>(null);
  const [view, setView] = useState<View>("front");
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "denied" | "unavailable">("idle");
  const [landmarks, setLandmarks] = useState<PoseLandmarks | null>(null);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    providerRef.current?.dispose();
  }, []);

  async function startCamera() {
    setStatus("connecting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera unavailable");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" }, audio: false });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const provider = new BlazePoseProvider();
        providerRef.current = provider;
        await provider.init(videoRef.current, stream);
        provider.start((frame) => {
          if (frame.frameQuality === "good") setLandmarks(frame.landmarks);
        });
      }
      setStatus("connected");
    } catch (error) {
      setStatus(error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError") ? "denied" : "unavailable");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    providerRef.current?.dispose();
    providerRef.current = null;
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setLandmarks(null);
    setStatus("idle");
  }

  const sideView = view === "side";
  const statusCopy = status === "denied"
    ? "Camera permission is blocked. Allow camera access in the browser address-bar settings, then try again."
    : status === "unavailable"
      ? "No camera was available. Check that another app is not using it, then try again or use Demo View."
      : "Place the camera at shoulder height, keep your whole body visible, and use even lighting.";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Camera className="h-4 w-4" /> Camera assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(value) => setView(value as View)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList><TabsTrigger value="front">Front view</TabsTrigger><TabsTrigger value="side">Side view</TabsTrigger></TabsList>
            <Badge variant={status === "connected" ? "success" : "outline"}>{status === "connected" ? "Camera connected" : "Camera ready to start"}</Badge>
          </div>
          {(["front", "side"] as View[]).map((currentView) => (
            <TabsContent key={currentView} value={currentView}>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy">
                {status === "connected" ? <video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover" style={{ transform: currentView === "front" ? "scaleX(-1)" : undefined }} /> : <PoseSkeleton landmarks={currentView === "side" ? { ...STATIC_DEMO_LANDMARKS, nose: { ...STATIC_DEMO_LANDMARKS.nose, x: 0.62 }, leftEar: { ...STATIC_DEMO_LANDMARKS.leftEar, x: 0.56 }, rightEar: { ...STATIC_DEMO_LANDMARKS.rightEar, x: 0.6 } } : STATIC_DEMO_LANDMARKS} className="absolute inset-0 h-full w-full opacity-80" highlightColor="#5eead4" />}
                {status === "connected" && landmarks && <div className="absolute inset-0" style={{ transform: currentView === "front" ? "scaleX(-1)" : undefined }}><PoseSkeleton landmarks={landmarks} className="h-full w-full" highlightColor="#5eead4" /></div>}
                <div className="absolute inset-[10%] rounded-2xl border border-dashed border-teal-200/50" />
                <div className="absolute left-4 top-4 flex items-center gap-2"><Badge variant="warning">{status === "connected" ? "Live camera" : "Demo guide"}</Badge>{sideView && <span className="rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white">Turn 90° sideways</span>}</div>
                {status !== "connected" && <div className="absolute inset-x-4 bottom-4 rounded-xl bg-slate-950/60 p-3 text-xs leading-5 text-white backdrop-blur"><p>{statusCopy}</p>{status === "idle" ? <Button size="sm" className="mt-2" onClick={startCamera}><Camera className="h-4 w-4" /> Start camera</Button> : <div className="mt-2 flex flex-wrap gap-2"><Button size="sm" onClick={startCamera}><RotateCcw className="h-4 w-4" /> Try again</Button><Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => setStatus("idle")}>Use demo view</Button></div>}</div>}
                {status === "connected" && <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-slate-950/55 px-3 py-2 text-xs text-white backdrop-blur"><span>{sideView ? "Keep one shoulder and hip aligned with the guide" : "Keep both shoulders and hips inside the frame"}</span><Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={stopCamera}><CameraOff className="h-4 w-4" /> Stop</Button></div>}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ScanLine className="h-4 w-4 text-teal-600" /> {sideView ? "Side view is best for head position and spine tilt." : "Front view is best for shoulder and pelvic symmetry."}</div>
            </TabsContent>
          ))}
        </Tabs>
        {status === "connected" && <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Camera preview is active. Keep the same distance when switching between views.</div>}
        <p className="mt-4 text-xs text-muted-foreground">Demo metrics below are illustrative until a validated pose model is connected to this assessment flow.</p>
      </CardContent>
    </Card>
  );
}