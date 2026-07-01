"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function RotatingBadge({
  className = "",
  text = "BETTER VEGAN CHEESE · SINCE 2006 · ",
  duration = 16,
}: {
  className?: string;
  text?: string;
  duration?: number;
}) {
  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="badgeCircle"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
          />
        </defs>
        <text className="fill-ink text-[13px] font-bold uppercase tracking-[0.18em]">
          <textPath href="#badgeCircle" startOffset="0">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green text-cream">
          <ArrowDown size={18} />
        </span>
      </div>
    </div>
  );
}
