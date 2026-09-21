"use client";

import { motion } from "framer-motion";
import type { PoseLandmarks } from "@/types/posture";

/**
 * Renders a body skeleton overlay from normalised [0,1] landmark
 * coordinates. Used on the landing-page hero (static demo pose), the Live
 * Monitor (live/demo pose), and the Assessment page. Highlights head, neck,
 * shoulders, spine and hips per the "Hero visual" spec.
 */
export function PoseSkeleton({
  landmarks,
  className,
  highlightColor = "#2dd4bf",
}: {
  landmarks: PoseLandmarks;
  className?: string;
  highlightColor?: string;
}) {
  const p = (key: keyof PoseLandmarks) => ({ x: landmarks[key].x * 100, y: landmarks[key].y * 100 });
  const nose = p("nose");
  const leftEar = p("leftEar");
  const rightEar = p("rightEar");
  const leftShoulder = p("leftShoulder");
  const rightShoulder = p("rightShoulder");
  const leftHip = p("leftHip");
  const rightHip = p("rightHip");
  const neck = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };
  const hipMid = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };

  const bones: [{ x: number; y: number }, { x: number; y: number }][] = [
    [leftEar, rightEar],
    [nose, neck],
    [leftShoulder, rightShoulder],
    [neck, hipMid],
    [leftHip, rightHip],
    [leftShoulder, leftHip],
    [rightShoulder, rightHip],
  ];

  const joints = [
    { pos: nose, label: "Head" },
    { pos: neck, label: "Neck" },
    { pos: leftShoulder, label: "Shoulder" },
    { pos: rightShoulder, label: "Shoulder" },
    { pos: hipMid, label: "Spine base" },
    { pos: leftHip, label: "Hip" },
    { pos: rightHip, label: "Hip" },
  ];

  return (
    <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <filter id="skeleton-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {bones.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={highlightColor}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.85}
          filter="url(#skeleton-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
        />
      ))}
      {joints.map((j, i) => (
        <circle key={i} cx={j.pos.x} cy={j.pos.y} r={1.4} fill="#ffffff" stroke={highlightColor} strokeWidth={0.6} />
      ))}
    </svg>
  );
}

export const STATIC_DEMO_LANDMARKS: PoseLandmarks = {
  nose: { x: 0.52, y: 0.22, z: 0, visibility: 1 },
  leftEye: { x: 0.505, y: 0.205, z: 0, visibility: 1 },
  rightEye: { x: 0.535, y: 0.205, z: 0, visibility: 1 },
  leftEar: { x: 0.49, y: 0.215, z: 0, visibility: 1 },
  rightEar: { x: 0.55, y: 0.215, z: 0, visibility: 1 },
  leftShoulder: { x: 0.42, y: 0.42, z: 0, visibility: 1 },
  rightShoulder: { x: 0.62, y: 0.415, z: 0, visibility: 1 },
  leftHip: { x: 0.46, y: 0.72, z: 0, visibility: 1 },
  rightHip: { x: 0.58, y: 0.718, z: 0, visibility: 1 },
};
