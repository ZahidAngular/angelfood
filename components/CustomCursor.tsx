"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ChefHat } from "lucide-react";

/**
 * A "meet the chef" accent that trails the mouse over recipe/food touchpoints.
 * The native cursor stays visible everywhere — this only adds a small,
 * chef-hat badge near elements explicitly opted in via `data-cursor`.
 */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.5 });

  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      setActive(!!target);
      setLabel(target?.getAttribute("data-cursor") || "");
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
    >
      <motion.div
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scale: active ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex -translate-x-1/2 -translate-y-[130%] flex-col items-center gap-1.5"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink shadow-[0_10px_24px_-8px_rgba(20,66,44,0.5)]">
          <ChefHat size={20} />
        </span>
        {label && (
          <span className="whitespace-nowrap rounded-full bg-green px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
