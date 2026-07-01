"use client";

import { motion } from "framer-motion";

/**
 * Runs on every route change (App Router template).
 * A green curtain lifts away while the page content fades up —
 * a smooth, award-style page transition.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-green"
      >
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl font-extrabold text-cream"
        >
          Angel<span className="text-gold">Food</span>
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
