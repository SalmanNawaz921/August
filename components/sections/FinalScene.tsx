"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FinalScene() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="final-scene" id="finale" ref={ref}>
      {/* Background ambient glow */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 55%, rgba(139,0,56,0.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <motion.span
        className="final-rose-glow"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        🌹
      </motion.span>

      <motion.div
        className="ornament"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="ornament-line" />
        <div className="ornament-line" />
      </motion.div>

      <motion.p
        className="final-quote"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Some flowers fade&hellip;
        <span>but some feelings stay forever.</span>
      </motion.p>

      <motion.span
        className="final-sig"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.8 }}
      >
        — for amnaaaa, always —
      </motion.span>
    </section>
  );
}
