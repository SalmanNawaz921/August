"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PetalMessage as PMsg } from "@/lib/messages";

interface Props {
  message: PMsg;
  onClose: () => void;
}

export default function PetalModal({ message, onClose }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-card"
          initial={{ scale: 0.6, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 30 }}
          transition={{ duration: 0.42, type: "spring", stiffness: 200, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="modal-eyebrow">a hidden thought</span>

          <p className="modal-text">&ldquo;{message.text}&rdquo;</p>
          <p className="modal-sub">{message.sub}</p>

          <button className="modal-close" onClick={onClose}>
            close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
