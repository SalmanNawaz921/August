"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";
import HeartParticles from "./HeartParticles";

/* ─── Camera parallax ─────────────────────────────── */
function CameraParallax() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 0.9,
        y: -(e.clientY / window.innerHeight - 0.5) * 0.6,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Types ───────────────────────────────────────── */
export type ScenePhase =
  | "particles"
  | "heart-forming"
  | "heart-formed"
  | "transition"
  | "bouquet";

type HeartPhase = "hidden" | "gathering" | "formed" | "exploding";

function phaseToHeart(p: ScenePhase): HeartPhase {
  if (p === "particles" || p === "bouquet") return "hidden";
  if (p === "heart-forming") return "gathering";
  if (p === "heart-formed") return "formed";
  return "exploding";
}

/* ─── Main export ─────────────────────────────────── */
export default function ThreeScene({ phase }: { phase: ScenePhase }) {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100dvh",
        zIndex: 0,
        pointerEvents: "none",
      }}
      camera={{ position: [0, 0, 5.8], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      {/* Cinematic lighting */}
      <ambientLight intensity={0.12} color="#15000a" />
      <pointLight position={[2, 4, 3]}  intensity={3}   color="#960040" decay={2} />
      <pointLight position={[-4, -2, 1]} intensity={0.9} color="#3a0018" decay={2} />
      <pointLight position={[0, -3, 2]}  intensity={0.4} color="#0a0005" decay={2} />

      <CameraParallax />
      <ParticleBackground />
      <HeartParticles phase={phaseToHeart(phase)} />
    </Canvas>
  );
}
