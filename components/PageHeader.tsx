"use client";

import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  const words = title.split(" ");
  return (
    <header className="relative overflow-hidden bg-cream pb-12 pt-44 sm:pb-16 sm:pt-52">
      <div className="pointer-events-none absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm font-semibold uppercase tracking-[0.22em] text-coral"
        >
          ✦ {eyebrow}
        </motion.p>

        <h1 className="mt-5 max-w-5xl font-display text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.85,
                  delay: 0.35 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block pr-[0.25em]"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}
