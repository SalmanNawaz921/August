"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Types ───────────────────────────────── */
export type HeartPhase = "hidden" | "gathering" | "formed" | "exploding";

/* ─── Constants ───────────────────────────── */
const N = 1800;
const SCALE = 0.092;

/* Heart parametric formula (classic) */
function heartXY(t: number): [number, number] {
  const x = 16 * Math.pow(Math.sin(t), 3) * SCALE;
  const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * SCALE;
  return [x, y];
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/* ─── Component ───────────────────────────── */
export default function HeartParticles({ phase }: { phase: HeartPhase }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const progress   = useRef(0);
  const exploding  = useRef(0);
  const prevPhase  = useRef<HeartPhase>(phase);

  /* ── Build initial (scattered) positions ── */
  const initial = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = Math.random() * 5 + 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  /* ── Build target (heart) positions ── */
  const target = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const [x, y] = heartXY(t);
      // small random jitter around the curve for organic look
      arr[i * 3]     = x + (Math.random() - 0.5) * 0.06;
      arr[i * 3 + 1] = y + (Math.random() - 0.5) * 0.06 - 0.05; // slight vertical offset
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.45;             // depth layer
    }
    return arr;
  }, []);

  /* ── Explosion velocity vectors ── */
  const explodeV = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      // Spread outward from heart, slightly upward
      arr[i * 3]     = (Math.random() - 0.5) * 0.18;
      arr[i * 3 + 1] = Math.random() * 0.12 + 0.02;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    return arr;
  }, []);

  /* ── Geometry ── */
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(initial.slice(), 3));
    return g;
  }, [initial]);

  /* ── Reset counters on phase change ── */
  useEffect(() => {
    if (prevPhase.current !== phase) {
      if (phase === "gathering") progress.current = 0;
      if (phase === "exploding") exploding.current = 0;
      if (phase === "hidden") {
        // Reset material opacity for next time
        if (pointsRef.current?.material) {
          (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.88;
        }
      }
      prevPhase.current = phase;
    }
  }, [phase]);

  /* ── Animation loop ── */
  useFrame((_, dt) => {
    if (!pointsRef.current || phase === "hidden") return;

    const arr = geometry.attributes.position.array as Float32Array;
    const mat = pointsRef.current.material as THREE.PointsMaterial;

    if (phase === "gathering") {
      progress.current = Math.min(progress.current + dt * 0.26, 1);
      const p = easeInOut(progress.current);

      for (let i = 0; i < N; i++) {
        arr[i * 3]     = initial[i * 3]     + (target[i * 3]     - initial[i * 3])     * p;
        arr[i * 3 + 1] = initial[i * 3 + 1] + (target[i * 3 + 1] - initial[i * 3 + 1]) * p;
        arr[i * 3 + 2] = initial[i * 3 + 2] + (target[i * 3 + 2] - initial[i * 3 + 2]) * p;
      }
      // Fade in
      mat.opacity = Math.min(0.88, progress.current * 1.5);

    } else if (phase === "formed") {
      // Gentle heartbeat pulse
      const pulse = 1 + Math.sin(Date.now() * 0.0014) * 0.038;
      for (let i = 0; i < N; i++) {
        arr[i * 3]     = target[i * 3]     * pulse;
        arr[i * 3 + 1] = target[i * 3 + 1] * pulse;
        arr[i * 3 + 2] = target[i * 3 + 2];
      }
      mat.opacity = 0.88;

      // Slight color pulse (oscillate between red and bright)
      const c = 0.75 + Math.sin(Date.now() * 0.0014) * 0.25;
      mat.color.setRGB(c, 0, c * 0.15);

    } else if (phase === "exploding") {
      exploding.current = Math.min(exploding.current + dt * 1.1, 1);
      const ep = easeInOut(exploding.current);

      for (let i = 0; i < N; i++) {
        arr[i * 3]     = target[i * 3]     * (1 + ep * 0.3) + explodeV[i * 3]     * ep * 28;
        arr[i * 3 + 1] = target[i * 3 + 1] * (1 + ep * 0.3) + explodeV[i * 3 + 1] * ep * 28;
        arr[i * 3 + 2] = target[i * 3 + 2]                   + explodeV[i * 3 + 2] * ep * 28;
      }
      mat.opacity = Math.max(0, 0.88 - ep * 1.3);
    }

    geometry.attributes.position.needsUpdate = true;
  });

  if (phase === "hidden") return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.058}
        color="#cc0038"
        transparent
        opacity={0.88}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
