"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MESSAGES } from "@/lib/messages";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HiddenMessages() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section" id="hidden-messages" ref={ref}>
      {/* Subtle top gradient separator */}
      <div
        style={{
          position: "absolute", top: 0, left: "10%", right: "10%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(139,0,56,0.3), transparent)",
        }}
      />

      <motion.div
        className="section-inner"
        variants={sectionVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="section-label" variants={itemUp}>
          hidden thoughts
        </motion.div>

        <motion.h2 className="section-heading" variants={itemUp}>
          Things I Never <em>Said Out Loud</em>
        </motion.h2>

        <motion.p className="section-body" variants={itemUp}>
          Every petal hides something. Here are the ones that didn&rsquo;t fit
          inside a single flower.
        </motion.p>

        <motion.div className="msg-grid" variants={sectionVariants}>
          {MESSAGES.map((msg, i) => (
            <motion.div className="msg-card" key={msg.id} variants={cardVariant}>
              <div className="msg-card-number">{String(i + 1).padStart(2, "0")}</div>
              <p className="msg-card-text">&ldquo;{msg.text}&rdquo;</p>
              <span className="msg-card-sub">{msg.sub}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
