"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/**
 * Image that reveals with a clip-path wipe as it enters the viewport,
 * while the inner image scales/parallax-shifts on scroll. Smooth + awwwards-y.
 */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  parallax = 14,
  rounded = "rounded-[2rem]",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  unoptimized = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: number;
  rounded?: string;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallax}%`, `${parallax}%`]
  );

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${rounded} ${className ?? ""}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={
        inView
          ? { clipPath: "inset(0% 0% 0% 0%)" }
          : { clipPath: "inset(100% 0% 0% 0%)" }
      }
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          unoptimized={unoptimized}
          sizes={sizes}
          className={`object-cover ${imgClassName ?? ""}`}
        />
      </motion.div>
    </motion.div>
  );
}
