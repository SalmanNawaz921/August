"use client";

import { useEffect, useRef, useState } from "react";
import HeartScene from "@/components/HeartScene";
import BurstTransition from "@/components/BurstTransition";
import RoseScene from "@/components/RoseScene";
import ParticleField from "@/components/ParticleField";

type Stage = "heart" | "burst" | "rose";

export default function Home() {
  const [stage, setStage] = useState<Stage>("heart");
  const [heartFading, setHeartFading] = useState(false);

  useEffect(() => {
    // Heart beats for 3.5s, then transition
    const timer1 = setTimeout(() => {
      setHeartFading(true);
    }, 3500);

    const timer2 = setTimeout(() => {
      setStage("burst");
    }, 4300);

    const timer3 = setTimeout(() => {
      setStage("rose");
    }, 5200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <main className="scene">
      {/* Ambient shimmer overlay */}
      <div className="shimmer-overlay" />

      {/* Always-on particle field */}
      <ParticleField active={stage === "rose"} />

      {/* Ambient rings */}
      <AmbientRings />

      {/* Stage 1: Heart */}
      {(stage === "heart" || stage === "burst") && (
        <HeartScene fading={heartFading} />
      )}

      {/* Stage 2: Burst */}
      {stage === "burst" && <BurstTransition />}

      {/* Stage 3: Rose */}
      {stage === "rose" && <RoseScene />}
    </main>
  );
}

function AmbientRings() {
  return (
    <>
      {[240, 340, 460, 580].map((size, i) => (
        <div
          key={i}
          className="ambient-ring"
          style={{
            width: size,
            height: size,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${6 + i}s`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
}
