"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PetalMessage } from "@/lib/messages";

interface Props {
  roseId: number;
  messages: PetalMessage[];
  onPetalClick: (msg: PetalMessage) => void;
  size: number;
  animDelay: number;
}

const N_OUTER = 7;
const N_MID   = 5;
const N_INNER = 4;

export default function SingleRose({
  roseId, messages, onPetalClick, size, animDelay: d,
}: Props) {
  const [activePetal, setActivePetal] = useState<number | null>(null);

  const oW = size * 0.30, oH = size * 0.48;
  const mW = size * 0.22, mH = size * 0.34;
  const iW = size * 0.15, iH = size * 0.23;
  const bR = size * 0.11;

  const petalRadius = "48% 48% 50% 50% / 56% 56% 44% 44%";

  const handleClick = useCallback((i: number) => {
    setActivePetal(prev => (prev === i ? null : i));
    onPetalClick(messages[i % messages.length]);
  }, [messages, onPetalClick]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: d, duration: 1.1, type: "spring", stiffness: 70, damping: 11 }}
      style={{
        width: size, height: size,
        position: "relative",
        perspective: size * 5.5,
        perspectiveOrigin: "50% 44%",
      }}
    >
      <div style={{
        width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transform: "rotateX(20deg)",
        position: "relative",
      }}>

        {/* ─── Outer Petals (clickable) — TRUE BLACK ─── */}
        {Array.from({ length: N_OUTER }, (_, i) => {
          const angle = i * (360 / N_OUTER) + roseId * 7.3;
          const active = activePetal === i;
          const tiltX  = active ? -12 : -58 - (i % 3) * 3;

          return (
            <div key={`o${i}`} style={{
              position: "absolute", bottom: "50%", left: "50%",
              marginLeft: -oW / 2,
              width: oW, height: oH,
              transformOrigin: "bottom center",
              transform: `rotateZ(${angle}deg)`,
              transformStyle: "preserve-3d",
              zIndex: active ? 20 : 1,
            }}>
              <div
                role="button"
                tabIndex={0}
                aria-label={`Rose petal ${i + 1}`}
                onClick={() => handleClick(i)}
                onMouseEnter={e => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.filter =
                      "brightness(1.8) drop-shadow(0 0 12px rgba(180,170,210,0.45))";
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.filter = "";
                }}
                style={{
                  width: "100%", height: "100%",
                  transformOrigin: "bottom center",
                  transform: `rotateX(${tiltX}deg) scale(${active ? 1.12 : 1})`,
                  transition:
                    "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), filter 0.22s ease, box-shadow 0.3s ease",
                  /* TRUE BLACK petals — near-black with faint cool undertone */
                  background:
                    `radial-gradient(ellipse at ${35 + (i % 3) * 9}% ${22 + (i % 2) * 7}%, #100e14, #080710 56%, #030305)`,
                  borderRadius: petalRadius,
                  border: "1px solid rgba(50,45,65,0.22)",
                  boxShadow: active
                    ? "inset 0 0 24px rgba(10,8,18,0.7), 0 0 22px rgba(130,120,180,0.45), 0 10px 28px rgba(0,0,0,0.6)"
                    : "inset 0 0 18px rgba(5,4,10,0.6), 0 5px 14px rgba(0,0,0,0.5)",
                  cursor: "pointer",
                  filter: active ? "brightness(1.6)" : undefined,
                }}
              />
            </div>
          );
        })}

        {/* ─── Middle Petals — BLACK ─── */}
        {Array.from({ length: N_MID }, (_, i) => (
          <div key={`m${i}`} style={{
            position: "absolute", bottom: "50%", left: "50%",
            marginLeft: -mW / 2,
            width: mW, height: mH,
            transformOrigin: "bottom center",
            transform: `rotateZ(${20 + i * 72 + roseId * 5.1}deg)`,
            transformStyle: "preserve-3d",
            pointerEvents: "none", zIndex: 5,
          }}>
            <div style={{
              width: "100%", height: "100%",
              transformOrigin: "bottom center",
              transform: `rotateX(${-42 - (i % 2) * 5}deg)`,
              background: "radial-gradient(ellipse at 42% 30%, #0c0a10, #06050a 60%, #030305)",
              borderRadius: "46% 46% 50% 50% / 56% 56% 44% 44%",
              border: "1px solid rgba(40,36,55,0.28)",
              boxShadow: "inset 0 0 14px rgba(4,3,8,0.6), 0 3px 10px rgba(0,0,0,0.45)",
            }} />
          </div>
        ))}

        {/* ─── Inner Petals — DARKEST BLACK ─── */}
        {Array.from({ length: N_INNER }, (_, i) => (
          <div key={`i${i}`} style={{
            position: "absolute", bottom: "50%", left: "50%",
            marginLeft: -iW / 2,
            width: iW, height: iH,
            transformOrigin: "bottom center",
            transform: `rotateZ(${32 + i * 90 + roseId * 3.2}deg)`,
            transformStyle: "preserve-3d",
            pointerEvents: "none", zIndex: 8,
          }}>
            <div style={{
              width: "100%", height: "100%",
              transformOrigin: "bottom center",
              transform: `rotateX(${-28 - (i % 2) * 6}deg)`,
              background: "radial-gradient(ellipse at 44% 32%, #0a080e, #050408 58%, #020204)",
              borderRadius: "46% 46% 50% 50% / 56% 56% 44% 44%",
              border: "1px solid rgba(38,34,50,0.3)",
              boxShadow: "inset 0 0 10px rgba(3,2,6,0.55)",
            }} />
          </div>
        ))}

        {/* ─── Centre Bud — NEAR-BLACK ─── */}
        <div style={{
          position: "absolute", bottom: "50%", left: "50%",
          marginLeft: -bR, marginBottom: -bR * 0.12,
          width: bR * 2, height: bR * 2.15,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 36% 30%, #0d0b12, #060508, #020204)",
          border: "1px solid rgba(42,38,56,0.4)",
          boxShadow: "inset 0 0 12px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.9)",
          zIndex: 10, pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: "18%", left: "28%",
            width: "26%", height: "20%",
            borderRadius: "50%",
            background: "rgba(200,195,220,0.04)",
          }} />
        </div>
      </div>
    </motion.div>
  );
}
