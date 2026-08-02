"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SYMBOLS = [
  {
    icon: "◆",
    title: "Mystery & Elegance",
    text: "Black roses don't exist naturally — they're crafted, cultivated, intentional. Like the most meaningful gestures.",
  },
  {
    icon: "◇",
    title: "Rare Beauty",
    text: "What's rare carries weight. A black rose says 'I chose this because nothing ordinary could represent you.'",
  },
  {
    icon: "◈",
    title: "Rebirth & New Beginnings",
    text: "In the language of flowers, the dark rose marks the end of something old and the start of something extraordinary.",
  },
  {
    icon: "▪",
    title: "Devotion Beyond Words",
    text: "Some feelings run so deep they go beyond colour. Black holds all colours within it — every shade of how I feel.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WhyBlackRoses() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section" id="why-black-roses" ref={ref}>
      <motion.div
        className="section-inner"
        variants={sectionVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="section-label" variants={itemUp}>
          symbolism
        </motion.div>

        <motion.h2 className="section-heading" variants={itemUp}>
          Why <em>Black Roses</em>
        </motion.h2>

        <motion.div className="quote-block" variants={itemUp}>
          <p>
            They don&rsquo;t bloom in nature. They&rsquo;re made — deliberately,
            with intention. There&rsquo;s something poetic about a flower that
            only exists because someone wanted it to.
          </p>
          <div className="quote-attr">— the language of flowers</div>
        </motion.div>

        <motion.p className="section-body" variants={itemUp}>
          Most people pick red roses because it&rsquo;s easy, expected, safe.
          But you&rsquo;ve never been any of those things — and neither should
          the flower that represents what I feel. Black roses carry the weight
          of everything unsaid: the late-night conversations, the quiet moments,
          the way you make the ordinary feel significant.
        </motion.p>

        <motion.div className="symbol-grid" variants={sectionVariants}>
          {SYMBOLS.map((s, i) => (
            <motion.div className="symbol-card" key={i} variants={itemUp}>
              <span className="symbol-card-icon">{s.icon}</span>
              <h3 className="symbol-card-title">{s.title}</h3>
              <p className="symbol-card-text">{s.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
