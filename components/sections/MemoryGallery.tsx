"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

const MEMORIES = [
  {
    title: "The Quiet Moments",
    desc: "Not every memory needs sound. Some of the loudest ones happen in silence — the kind where nothing is said because nothing needs to be.",
  },
  {
    title: "Late-Night Conversations",
    desc: "The world shrinks to just a screen and a voice. Hours feel like minutes. Every 'one more thing' turns into another hour.",
  },
  {
    title: "The Way You Laugh",
    desc: "It's not rehearsed or performative. It catches you off guard — and that's exactly what makes it so disarming.",
  },
  {
    title: "Small Gestures, Big Weight",
    desc: "A message at the right time. Remembering something no one else noticed. The details that say more than grand gestures ever could.",
  },
  {
    title: "Your Stubbornness",
    desc: "The way you dig in when you believe in something. It's infuriating and impressive in equal measure. Never change that.",
  },
  {
    title: "Everything In Between",
    desc: "The ordinary days. The unremarkable afternoons. The nothing-special moments that somehow became the ones I think about most.",
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30, rotateY: 4 },
  visible: {
    opacity: 1, y: 0, rotateY: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function MemoryGallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section" id="memories" ref={ref}>
      <div
        style={{
          position: "absolute", top: 0, left: "10%", right: "10%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)",
        }}
      />

      <motion.div
        className="section-inner"
        variants={sectionVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="section-label" variants={itemUp}>
          fragments
        </motion.div>

        <motion.h2 className="section-heading" variants={itemUp}>
          A Gallery of <em>Moments</em>
        </motion.h2>

        <motion.p className="section-body" variants={itemUp}>
          Not photographs — just fragments of feeling, preserved in glass.
        </motion.p>

        <motion.div className="gallery-grid" variants={sectionVariants}>
          {MEMORIES.map((m, i) => (
            <motion.div className="gallery-card" key={i} variants={cardVariant}>
              <div className="gallery-card-img">
                {/* Abstract gradient art placeholder — each unique */}
                <div
                  style={{
                    width: "100%", height: "100%",
                    background: `radial-gradient(circle at ${30 + i * 12}% ${35 + i * 8}%, rgba(139,0,56,${0.2 + i * 0.04}), transparent 60%), radial-gradient(circle at ${70 - i * 8}% ${60 + i * 5}%, rgba(201,168,76,${0.08 + i * 0.02}), transparent 50%)`,
                  }}
                />
                {/* Roman numeral */}
                <span
                  style={{
                    position: "absolute", bottom: 12, right: 16,
                    fontFamily: "var(--ff-italic)", fontStyle: "italic",
                    fontSize: "2.2rem", color: "rgba(253,248,245,0.06)",
                    fontWeight: 300,
                  }}
                >
                  {["I", "II", "III", "IV", "V", "VI"][i]}
                </span>
              </div>
              <div className="gallery-card-body">
                <h3 className="gallery-card-title">{m.title}</h3>
                <p className="gallery-card-desc">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
