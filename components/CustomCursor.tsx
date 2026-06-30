"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [label, setLabel] = useState("");

  useEffect(() => {
    // Skip on touch / coarse pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setHidden(false);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      const interactive = t.closest(
        "a, button, [data-cursor], input, [role='button']"
      ) as HTMLElement | null;
      setHover(!!interactive);
      setLabel(interactive?.getAttribute("data-cursor") || "");
    };
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [x, y]);

  if (hidden) return null;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
    >
      <motion.div
        animate={{
          width: hover ? (label ? 96 : 56) : 14,
          height: hover ? (label ? 96 : 56) : 14,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green text-[11px] font-bold uppercase tracking-wider text-cream mix-blend-difference"
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
