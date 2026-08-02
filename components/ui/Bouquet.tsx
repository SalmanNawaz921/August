"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SingleRose from "./SingleRose";
import { PetalMessage, getRoseMessages } from "@/lib/messages";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DESIGN SYSTEM — 520 × 780 viewBox
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DW = 520;
const DH = 780;
const WRAP = { x: 260, y: 540 };

/* ── 9 Roses — natural dome with centre prominence ── */
interface RoseDef {
  cx: number; cy: number; size: number;
  rot: number; z: number;
  stemDelay: number; roseDelay: number;
}

const ROSES: RoseDef[] = [
  // z:2 — back row (painted first)
  { cx: 192, cy: 128, size: 94,  rot: -9,  z: 2, stemDelay: 1.80, roseDelay: 2.75 },
  { cx: 336, cy: 132, size: 90,  rot: 13,  z: 2, stemDelay: 1.90, roseDelay: 2.85 },
  // z:3 — sides + small buds
  { cx: 100, cy: 270, size: 102, rot: -20, z: 3, stemDelay: 1.30, roseDelay: 2.20 },
  { cx: 418, cy: 260, size: 105, rot: 17,  z: 3, stemDelay: 1.40, roseDelay: 2.30 },
  { cx: 130, cy: 330, size: 74,  rot: -28, z: 3, stemDelay: 2.10, roseDelay: 3.05 },  // small bud left
  { cx: 395, cy: 318, size: 72,  rot: 24,  z: 3, stemDelay: 2.20, roseDelay: 3.15 },  // small bud right
  // z:4 — flanking the centre
  { cx: 162, cy: 215, size: 128, rot: -11, z: 4, stemDelay: 0.70, roseDelay: 1.60 },
  { cx: 358, cy: 205, size: 124, rot: 9,   z: 4, stemDelay: 0.80, roseDelay: 1.70 },
  // z:5 — centre star
  { cx: 260, cy: 190, size: 148, rot: 0,   z: 5, stemDelay: 0.20, roseDelay: 1.05 },
];

function stemPath(r: RoseDef): string {
  const baseY = r.cy + r.size * 0.30;
  const dx = r.cx - WRAP.x;
  const cp1x = WRAP.x + dx * 0.25;
  const cp1y = WRAP.y - 75;
  const cp2x = r.cx - dx * 0.12;
  const cp2y = baseY + 60;
  return `M ${WRAP.x},${WRAP.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${r.cx},${baseY}`;
}

/* ── Leaves on stems ── */
const LEAVES = [
  { d: "M 200,388 C 184,376 168,381 172,392 C 176,403 195,396 200,388 Z", delay: 2.50 },
  { d: "M 330,374 C 346,362 362,367 358,378 C 354,389 335,382 330,374 Z", delay: 2.60 },
  { d: "M 254,400 C 240,390 226,394 230,405 C 234,416 250,408 254,400 Z", delay: 2.45 },
  { d: "M 150,425 C 136,415 122,419 126,430 C 130,441 146,433 150,425 Z", delay: 2.70 },
  { d: "M 382,418 C 396,406 410,410 406,421 C 402,432 386,424 382,418 Z", delay: 2.75 },
  { d: "M 215,178 C 204,170 194,174 197,182 C 200,190 212,185 215,178 Z", delay: 3.00 },
  { d: "M 316,173 C 327,165 337,169 334,177 C 331,185 320,180 316,173 Z", delay: 3.00 },
  { d: "M 268,392 C 278,380 290,385 286,396 C 282,406 272,400 268,392 Z", delay: 2.55 },
];

/* ── Eucalyptus sprigs — groups of elongated leaves ── */
const EUCALYPTUS = [
  { // upper left cluster
    stem: "M 175,162 L 168,138",
    leaves: [
      { cx: 162, cy: 140, rx: 9, ry: 4, rot: -30 },
      { cx: 172, cy: 147, rx: 8, ry: 3.5, rot: 18 },
      { cx: 165, cy: 152, rx: 7, ry: 3, rot: -15 },
    ],
    delay: 3.1,
  },
  { // upper right cluster
    stem: "M 348,158 L 355,135",
    leaves: [
      { cx: 360, cy: 138, rx: 9, ry: 4, rot: 25 },
      { cx: 350, cy: 145, rx: 7, ry: 3.5, rot: -20 },
      { cx: 358, cy: 150, rx: 8, ry: 3, rot: 12 },
    ],
    delay: 3.15,
  },
  { // left side
    stem: "M 108,248 L 95,228",
    leaves: [
      { cx: 90, cy: 230, rx: 10, ry: 4, rot: -35 },
      { cx: 100, cy: 238, rx: 8, ry: 3.5, rot: 20 },
    ],
    delay: 3.2,
  },
  { // right side
    stem: "M 420,242 L 435,224",
    leaves: [
      { cx: 440, cy: 226, rx: 10, ry: 4, rot: 30 },
      { cx: 430, cy: 234, rx: 8, ry: 3.5, rot: -18 },
    ],
    delay: 3.25,
  },
  { // between center and left
    stem: "M 195,195 L 185,178",
    leaves: [
      { cx: 180, cy: 180, rx: 7, ry: 3, rot: -22 },
      { cx: 188, cy: 186, rx: 6, ry: 2.8, rot: 15 },
    ],
    delay: 3.3,
  },
];

/* ── Baby's breath filler ── */
const FILLERS = [
  { cx: 202, cy: 152, r: 3.2 }, { cx: 318, cy: 145, r: 2.8 },
  { cx: 115, cy: 242, r: 3.0 }, { cx: 400, cy: 234, r: 2.6 },
  { cx: 178, cy: 170, r: 2.2 }, { cx: 344, cy: 163, r: 2.4 },
  { cx: 130, cy: 255, r: 2.0 }, { cx: 394, cy: 250, r: 2.5 },
  { cx: 226, cy: 138, r: 2.8 }, { cx: 298, cy: 140, r: 2.2 },
  { cx: 168, cy: 258, r: 2.0 }, { cx: 364, cy: 246, r: 2.2 },
  { cx: 245, cy: 152, r: 1.8 }, { cx: 275, cy: 148, r: 1.6 },
  { cx: 142, cy: 290, r: 2.0 }, { cx: 378, cy: 282, r: 1.8 },
  { cx: 210, cy: 165, r: 1.5 }, { cx: 308, cy: 158, r: 1.7 },
];

/* ── Sparkle particles on roses ── */
const SPARKLES = [
  { cx: 240, cy: 178, r: 1.3, dur: 3.2 },
  { cx: 285, cy: 185, r: 1.1, dur: 2.8 },
  { cx: 175, cy: 210, r: 1.0, dur: 3.5 },
  { cx: 348, cy: 198, r: 1.2, dur: 3.0 },
  { cx: 115, cy: 262, r: 0.9, dur: 2.6 },
  { cx: 405, cy: 255, r: 1.1, dur: 3.3 },
  { cx: 260, cy: 172, r: 1.4, dur: 2.9 },
  { cx: 195, cy: 240, r: 1.0, dur: 3.1 },
  { cx: 330, cy: 225, r: 0.8, dur: 3.4 },
  { cx: 152, cy: 320, r: 0.9, dur: 2.7 },
];

const BUNDLE_X = [228, 240, 252, 264, 276, 288];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface Props { onPetalClick: (msg: PetalMessage) => void; }

export default function Bouquet({ onPetalClick }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setScale(w / DW);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="bouquet-overlay">
      {/* ─── Title ─── */}
      <motion.h1
        className="bouquet-title"
        initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 3.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        For Amnaaaa
      </motion.h1>

      <motion.p
        className="bouquet-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.3, duration: 0.8 }}
      >
        with every petal, a thought of you
      </motion.p>

      {/* ─── Bouquet Container ─── */}
      <div
        ref={outerRef}
        style={{
          width: "min(480px, 85vw)",
          height: DH * scale,
          position: "relative",
          flexShrink: 0,
          overflow: "visible",
        }}
      >
        <div style={{
          width: DW, height: DH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute", top: 0, left: 0,
        }}>
          <svg
            viewBox={`0 0 ${DW} ${DH}`}
            width={DW} height={DH}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            <defs>
              <filter id="stem-shadow">
                <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.45" />
              </filter>
              <filter id="soft-glow">
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <filter id="sparkle-glow">
                <feGaussianBlur stdDeviation="2" />
              </filter>
              <linearGradient id="wrapper-fill" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%"   stopColor="#4a1028" />
                <stop offset="25%"  stopColor="#3d0c22" />
                <stop offset="55%"  stopColor="#2e0618" />
                <stop offset="100%" stopColor="#1c020c" />
              </linearGradient>
              <linearGradient id="wrapper-inner" x1="0.3" y1="0" x2="0.7" y2="1">
                <stop offset="0%"   stopColor="#3a0c20" />
                <stop offset="100%" stopColor="#200610" />
              </linearGradient>
              <linearGradient id="tissue-fill" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%"   stopColor="rgba(232,208,128,0.28)" />
                <stop offset="100%" stopColor="rgba(201,168,76,0.06)" />
              </linearGradient>
              <linearGradient id="ribbon-sheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(201,168,76,0.2)" />
                <stop offset="50%"  stopColor="rgba(201,168,76,0.04)" />
                <stop offset="100%" stopColor="rgba(201,168,76,0.16)" />
              </linearGradient>
              {/* Pattern for wrapper texture */}
              <pattern id="wrapper-texture" width="30" height="30" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="30" y2="30" stroke="rgba(80,25,45,0.08)" strokeWidth="0.5" />
                <line x1="30" y1="0" x2="0" y2="30" stroke="rgba(80,25,45,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* ══════════ WRAPPER CONE ══════════ */}

            {/* Main wrapper paper */}
            <motion.path
              d={`
                M 260,765
                C 208,660 105,435 55,265
                C 46,235 74,220 128,232
                C 182,243 222,226 260,230
                C 298,226 338,243 392,232
                C 446,220 474,235 465,265
                C 415,435 312,660 260,765 Z
              `}
              fill="url(#wrapper-fill)"
              stroke="rgba(100,30,55,0.45)"
              strokeWidth={1.5}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "260px 765px" }}
            />

            {/* Wrapper texture overlay */}
            <motion.path
              d={`
                M 260,765
                C 208,660 105,435 55,265
                C 46,235 74,220 128,232
                C 182,243 222,226 260,230
                C 298,226 338,243 392,232
                C 446,220 474,235 465,265
                C 415,435 312,660 260,765 Z
              `}
              fill="url(#wrapper-texture)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            />

            {/* Inner shadow for depth */}
            <motion.path
              d={`
                M 260,740
                C 220,650 140,440 100,290
                C 100,290 180,260 260,265
                C 340,260 420,290 420,290
                C 380,440 300,650 260,740 Z
              `}
              fill="url(#wrapper-inner)"
              opacity={0.45}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 0.5, duration: 1 }}
            />

            {/* Paper crease lines */}
            {[
              "M 260,765 C 240,650 185,430 135,275",
              "M 260,765 C 280,650 335,430 385,275",
              "M 260,765 C 248,640 198,445 160,305",
              "M 260,765 C 272,640 322,445 360,305",
              "M 260,765 L 260,300",
            ].map((d, i) => (
              <motion.path
                key={`crease-${i}`}
                d={d}
                fill="none"
                stroke={i === 4 ? "rgba(85,25,42,0.12)" : "rgba(85,25,42,0.18)"}
                strokeWidth={i === 4 ? 0.5 : 0.7}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
              />
            ))}

            {/* Embossed decorative border on wrapper */}
            <motion.path
              d={`
                M 200,420
                C 215,415 230,422 245,418
                C 255,414 265,424 275,418
                C 285,414 300,422 315,418
                C 330,414 340,420 340,420
              `}
              fill="none"
              stroke="rgba(201,168,76,0.12)"
              strokeWidth={1}
              strokeDasharray="3 6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            />

            {/* Gold foil trim at top edge */}
            <motion.path
              d={`
                M 55,265
                C 46,235 74,220 128,232
                C 182,243 222,226 260,230
                C 298,226 338,243 392,232
                C 446,220 474,235 465,265
              `}
              fill="none"
              stroke="rgba(201,168,76,0.55)"
              strokeWidth={2.2}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.9, duration: 1.3 }}
            />

            {/* Tissue paper — crinkled edge */}
            <motion.path
              d={`
                M 60,262
                C 78,242 98,258 126,246
                C 152,234 172,254 202,242
                C 228,232 245,250 260,238
                C 275,250 292,232 318,242
                C 348,254 368,234 394,246
                C 422,258 442,242 460,262
              `}
              fill="url(#tissue-fill)"
              stroke="rgba(201,168,76,0.18)"
              strokeWidth={0.6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            />
            <motion.path
              d={`
                M 72,260
                C 92,246 112,258 140,248
                C 165,238 182,252 212,242
                C 238,232 250,248 260,240
                C 270,248 282,232 308,242
                C 338,252 355,238 380,248
                C 408,258 428,246 448,260
                L 448,305 L 72,305 Z
              `}
              fill="url(#tissue-fill)"
              opacity={0.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.2, duration: 0.7 }}
            />

            {/* ── Ambient glow ── */}
            <motion.ellipse
              cx={260} cy={235} rx={190} ry={150}
              fill="rgba(100,80,140,0.035)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 2.5 }}
            />

            {/* ── Stems ── */}
            {ROSES.map((r, i) => (
              <motion.path
                key={`stem-${i}`}
                d={stemPath(r)}
                fill="none"
                stroke="#1a2808"
                strokeWidth={r.z >= 4 ? 6 : r.size < 80 ? 4 : 5}
                strokeLinecap="round"
                filter="url(#stem-shadow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { delay: r.stemDelay, duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                  opacity: { delay: r.stemDelay, duration: 0.3 },
                }}
              />
            ))}

            {/* ── Stem thorns ── */}
            {[
              { x: 240, y: 420, rot: -30 },
              { x: 280, y: 390, rot: 25 },
              { x: 225, y: 450, rot: -20 },
              { x: 290, y: 360, rot: 30 },
            ].map((t, i) => (
              <motion.path
                key={`thorn-${i}`}
                d={`M ${t.x},${t.y} L ${t.x + Math.cos(t.rot * Math.PI / 180) * 6},${t.y - 5}`}
                stroke="#1a2808"
                strokeWidth={1.8}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 2.8 + i * 0.1, duration: 0.3 }}
              />
            ))}

            {/* ── Leaf accents ── */}
            {LEAVES.map((lf, i) => (
              <motion.path
                key={`leaf-${i}`}
                d={lf.d}
                fill="#152206"
                stroke="rgba(28,40,8,0.5)"
                strokeWidth={0.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: lf.delay, duration: 0.55 }}
              />
            ))}

            {/* ── Eucalyptus sprigs ── */}
            {EUCALYPTUS.map((sprig, si) => (
              <motion.g
                key={`euc-${si}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: sprig.delay, duration: 0.6 }}
              >
                <path d={sprig.stem} stroke="#1e3008" strokeWidth={1.2} fill="none" strokeLinecap="round" />
                {sprig.leaves.map((lf, li) => (
                  <ellipse
                    key={`el-${si}-${li}`}
                    cx={lf.cx} cy={lf.cy} rx={lf.rx} ry={lf.ry}
                    fill="#1a2a08"
                    stroke="rgba(30,45,10,0.4)"
                    strokeWidth={0.4}
                    transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}
                  />
                ))}
              </motion.g>
            ))}

            {/* ── Bundle below ribbon ── */}
            {BUNDLE_X.map((x, i) => (
              <motion.line
                key={`bnd-${i}`}
                x1={x} y1={558}
                x2={x + (i - 2.5) * 3.5} y2={720}
                stroke="#162006"
                strokeWidth={5}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.9 + i * 0.07, duration: 0.7, ease: "easeOut" }}
              />
            ))}

            {/* ══════════ RIBBON ══════════ */}
            <motion.rect
              x={200} y={520} width={120} height={34} rx={8}
              fill="#0f0005"
              stroke="rgba(201,168,76,0.48)"
              strokeWidth={1.5}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 3.15, duration: 0.6, type: "spring", stiffness: 90 }}
              style={{ transformOrigin: "260px 537px" }}
            />
            <motion.rect
              x={200} y={520} width={120} height={17} rx={8}
              fill="url(#ribbon-sheen)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.35, duration: 0.45 }}
            />

            {/* Bow loops */}
            <motion.path
              d="M 226,537 C 206,515 180,521 188,539 C 194,550 220,545 226,537 Z"
              fill="#16000a" stroke="rgba(201,168,76,0.35)" strokeWidth={0.8}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 3.30, duration: 0.45, type: "spring", stiffness: 100 }}
              style={{ transformOrigin: "226px 537px" }}
            />
            <motion.path
              d="M 294,537 C 314,515 340,521 332,539 C 326,550 300,545 294,537 Z"
              fill="#16000a" stroke="rgba(201,168,76,0.35)" strokeWidth={0.8}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 3.30, duration: 0.45, type: "spring", stiffness: 100 }}
              style={{ transformOrigin: "294px 537px" }}
            />

            {/* Knot */}
            <motion.ellipse
              cx={260} cy={537} rx={15} ry={10}
              fill="#1e0008" stroke="rgba(201,168,76,0.55)" strokeWidth={1}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3.40, duration: 0.35, type: "spring" }}
              style={{ transformOrigin: "260px 537px" }}
            />

            {/* Tails */}
            <motion.path
              d="M 230,554 C 218,574 214,598 222,628"
              fill="none" stroke="#13000a" strokeWidth={4} strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 3.48, duration: 0.55 }}
            />
            <motion.path
              d="M 290,554 C 302,574 306,598 298,628"
              fill="none" stroke="#13000a" strokeWidth={4} strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 3.48, duration: 0.55 }}
            />

            {/* ── Baby's breath ── */}
            {FILLERS.map((f, i) => (
              <motion.circle
                key={`fll-${i}`}
                cx={f.cx} cy={f.cy} r={f.r}
                fill="rgba(230,220,210,0.14)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.55 + i * 0.03, duration: 0.3 }}
              />
            ))}

            {/* ── Sparkle particles ── */}
            {SPARKLES.map((s, i) => (
              <motion.circle
                key={`spark-${i}`}
                cx={s.cx} cy={s.cy} r={s.r}
                fill="rgba(255,250,240,0.7)"
                filter="url(#sparkle-glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  delay: 4.0 + i * 0.15,
                  duration: s.dur,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* ── Bottom shadow ── */}
            <motion.ellipse
              cx={260} cy={770} rx={75} ry={6}
              fill="rgba(0,0,0,0.15)"
              filter="url(#soft-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 1.2 }}
            />
          </svg>

          {/* ━━━ Rose Heads ━━━ */}
          {ROSES.map((r, i) => (
            <div
              key={`rose-${i}`}
              style={{
                position: "absolute",
                left: r.cx - r.size / 2,
                top: r.cy - r.size / 2,
                width: r.size, height: r.size,
                transform: `rotate(${r.rot}deg)`,
                transformOrigin: "center",
                zIndex: r.z + 10,
                pointerEvents: "auto",
              }}
            >
              <SingleRose
                roseId={i}
                messages={getRoseMessages(i)}
                onPetalClick={onPetalClick}
                size={r.size}
                animDelay={r.roseDelay}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Hint ─── */}
      <motion.p
        className="petal-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.0, duration: 0.8 }}
      >
        touch a petal to reveal its secret
      </motion.p>
    </div>
  );
}
