"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PetalMessage } from "@/lib/messages";
import type { ScenePhase } from "@/components/three/ThreeScene";

/* ── Lazy-load heavy 3D component ── */
const ThreeScene = dynamic(() => import("@/components/three/ThreeScene"), {
  ssr: false,
  loading: () => null,
});

/* ── Lazy-load UI pieces ── */
const Bouquet       = dynamic(() => import("@/components/ui/Bouquet"),       { ssr: false });
const PetalModal    = dynamic(() => import("@/components/ui/PetalModal"),    { ssr: false });
const AmbientMusic  = dynamic(() => import("@/components/ui/AmbientMusic"), { ssr: false });

/* ── Lazy-load scroll sections ── */
const WhyBlackRoses  = dynamic(() => import("@/components/sections/WhyBlackRoses"),  { ssr: false });
const HiddenMessages = dynamic(() => import("@/components/sections/HiddenMessages"), { ssr: false });
const MemoryGallery  = dynamic(() => import("@/components/sections/MemoryGallery"),  { ssr: false });
const FinalScene     = dynamic(() => import("@/components/sections/FinalScene"),     { ssr: false });

/* ── Timeline (ms from START click) ── */
const HEART_START  = 1200;
const HEART_FORMED = 6500;
const EXPLODE      = 11000;
const BOUQUET      = 12800;

export default function Home() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<ScenePhase>("particles");
  const [selectedMsg, setSelectedMsg] = useState<PetalMessage | null>(null);

  /* ── Phase timeline — only begins after user clicks "Enter" ── */
  useEffect(() => {
    if (!started) return;
    const timers = [
      setTimeout(() => setPhase("heart-forming"), HEART_START),
      setTimeout(() => setPhase("heart-formed"),  HEART_FORMED),
      setTimeout(() => setPhase("transition"),    EXPLODE),
      setTimeout(() => setPhase("bouquet"),       BOUQUET),
    ];
    return () => timers.forEach(clearTimeout);
  }, [started]);

  const handlePetalClick = useCallback((msg: PetalMessage) => {
    setSelectedMsg(msg);
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  const showBouquet = phase === "bouquet";

  return (
    <>
      {/* ━━━ ENTRY OVERLAY — "click to begin" ━━━ */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="entry-overlay"
            onClick={handleStart}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="entry-diamond"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(201,168,76,0.15)",
                  "0 0 60px rgba(201,168,76,0.35)",
                  "0 0 30px rgba(201,168,76,0.15)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ✦
            </motion.div>

            <motion.h2
              className="entry-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              enter this moment
            </motion.h2>

            <motion.p
              className="entry-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              tap anywhere to begin
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━ AMBIENT MUSIC ━━━ */}
      <AmbientMusic phase={phase} started={started} />

      {/* ━━━ HERO ━━━ */}
      <section className="hero" id="hero">
        {started && <ThreeScene phase={phase} />}

        {/* Intro text */}
        <AnimatePresence>
          {started && (phase === "particles" || phase === "heart-forming") && (
            <motion.div
              className="intro-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="intro-date">August 1, 2026</p>
              <p className="intro-subtitle">something is forming&hellip;</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouquet overlay */}
        <AnimatePresence>
          {showBouquet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ position: "absolute", inset: 0, zIndex: 10 }}
            >
              <Bouquet onPetalClick={handlePetalClick} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        <AnimatePresence>
          {showBouquet && (
            <motion.div
              className="scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
            >
              <span>scroll</span>
              <div className="scroll-line" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ━━━ SCROLLABLE SECTIONS ━━━ */}
      {showBouquet && (
        <>
          <div className="ornament" style={{ margin: "0 auto", padding: "2rem 0" }}>
            <div className="ornament-line" />
            <span className="ornament-rose">🌹</span>
            <div className="ornament-line" />
          </div>
          <WhyBlackRoses />
          <HiddenMessages />
          <MemoryGallery />
          <FinalScene />
        </>
      )}

      {/* ━━━ PETAL MODAL ━━━ */}
      <AnimatePresence>
        {selectedMsg && (
          <PetalModal
            message={selectedMsg}
            onClose={() => setSelectedMsg(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
