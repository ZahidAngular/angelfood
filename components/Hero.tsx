"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Truck } from "lucide-react";
import { DELIVERY, PRE_SALE, formatPriceShort } from "@/lib/pricing";
import { Magnetic } from "./Magnetic";
import { RotatingBadge } from "./RotatingBadge";

type Floater = {
  src: string;
  className: string; // position + size
  depth: number; // parallax strength
  delay: number;
  rotate: number;
};

/**
 * What floats behind the hero while the pre-sale is on: the meals, since that
 * is what the copy is selling. Same positions as the pack shots below, so the
 * layout does not move when the offer ends — only the pictures.
 */
// Shown from the large breakpoint only: below it the copy runs the full
// width of the screen and a plate floating behind it sits on the words.
const PRE_SALE_FLOATERS: Floater[] = [
  {
    src: "/images/meals/butter-curry-v2.webp",
    className: "hidden lg:block right-[2%] top-[9%] w-[19vw] max-w-[240px]",
    depth: 120,
    delay: 0.5,
    rotate: -6,
  },
  {
    src: "/images/meals/saag-tofu-v2.webp",
    className: "hidden lg:block right-[25%] top-[5%] w-[11vw] max-w-[140px]",
    depth: 260,
    delay: 0.58,
    rotate: 9,
  },
  {
    src: "/images/meals/vege-lasagna-v2.webp",
    className: "hidden lg:block right-[18%] top-[34%] w-[14vw] max-w-[175px]",
    depth: 220,
    delay: 0.66,
    rotate: 8,
  },
  {
    src: "/images/meals/vege-korma-v2.webp",
    className: "hidden xl:block right-[1%] top-[43%] w-[13vw] max-w-[165px]",
    depth: 90,
    delay: 0.74,
    rotate: -4,
  },
  {
    src: "/images/meals/black-lentils-v2.webp",
    className: "hidden xl:block right-[24%] bottom-[14%] w-[12vw] max-w-[150px]",
    depth: 190,
    delay: 0.82,
    rotate: -9,
  },
  {
    src: "/images/meals/thai-green-curry-v2.webp",
    className: "hidden lg:block right-[5%] bottom-[7%] w-[15vw] max-w-[190px]",
    depth: 70,
    delay: 0.9,
    rotate: 5,
  },
];

const FLOATERS: Floater[] = [
  {
    src: "/images/lasagna.webp",
    className: "right-[4%] top-[14%] w-[26vw] max-w-[340px]",
    depth: 120,
    delay: 0.5,
    rotate: -6,
  },
  {
    src: "/images/grated.webp",
    className: "right-[26%] top-[40%] w-[20vw] max-w-[260px]",
    depth: 220,
    delay: 0.65,
    rotate: 8,
  },
  {
    src: "/images/butter-curry.webp",
    className: "right-[2%] bottom-[8%] w-[19vw] max-w-[250px]",
    depth: 70,
    delay: 0.8,
    rotate: 5,
  },
  {
    src: "/images/sour-cream.webp",
    className: "left-[3%] bottom-[6%] w-[15vw] max-w-[190px]",
    depth: 180,
    delay: 0.95,
    rotate: -10,
  },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-cream pt-40 sm:pt-44"
    >
      {/* gradient blobs */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-gold/25 blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-green-bright/20 blur-[130px]" />

      {/* Floating products — the meals while the pre-sale is on, because that
          is what the copy beside them is selling. */}
      {(PRE_SALE.active ? PRE_SALE_FLOATERS : FLOATERS).map((f, i) => (
        <Floater key={i} {...f} progress={scrollYProgress} index={i} />
      ))}

      {/* Spinning sticker badge — doubles as a scroll cue. Stood down for the
          pre-sale, where the copy reaches the bottom of the screen and the
          badge landed across the buttons. */}
      {!PRE_SALE.active && (
        <motion.div
          style={{ opacity: fade }}
          className="absolute bottom-[5%] left-1/2 z-30 hidden h-28 w-28 -translate-x-1/2 md:block"
        >
          <RotatingBadge />
        </motion.div>
      )}

      {/* Headline */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8"
      >
        {/* The pre-sale copy runs to four paragraphs, so it is held to a
            column rather than the full width the short headline could use —
            otherwise the line length runs past comfortable reading and the
            artwork has nowhere to go. */}
        <div className={PRE_SALE.active ? "lg:max-w-[54%]" : ""}>
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-green backdrop-blur"
        >
          {PRE_SALE.active ? (
            <>
              <Truck size={14} className="shrink-0" />
              Free delivery · save {formatPriceShort(DELIVERY.northIsland)}
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              Aotearoa&apos;s original vegan cheese co. · since 2006
            </>
          )}
        </motion.span>

        {/* Smaller than the standing headline: the pre-sale version carries
            three lines of its own underneath, and at 7rem the two together
            fill a phone screen before the copy starts. */}
        <h1
          className={`mt-6 font-display font-extrabold leading-[0.9] tracking-[-0.03em] text-ink ${
            PRE_SALE.active
              ? "text-[clamp(1.9rem,3.6vw,3.3rem)]"
              : "text-[clamp(2.5rem,7.5vw,7rem)]"
          }`}
        >
          {PRE_SALE.active ? (
            <>
              <Line delay={0.35}>
                We&apos;re open<span className="text-coral">!</span>
              </Line>
              <Line delay={0.45}>Your freezer just got</Line>
              <Line delay={0.55} className="text-green">
                a little more heavenly.
              </Line>
            </>
          ) : (
            <>
              <Line delay={0.35}>Your favourite</Line>
              <Line delay={0.45} className="text-green">
                foods,
              </Line>
              <Line delay={0.55}>
                plant-based<span className="text-coral">.</span>
              </Line>
            </>
          )}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className={`mt-8 text-ink-soft ${
            PRE_SALE.active
              ? "max-w-xl space-y-3 text-base leading-relaxed sm:text-lg"
              : "max-w-md text-lg leading-relaxed sm:text-xl"
          }`}
        >
          {PRE_SALE.active ? (
            <>
              <span className="block font-bold text-ink">
                Angel Food&apos;s online store is now open for pre-sales! Free
                delivery — save {formatPriceShort(DELIVERY.northIsland)}
              </span>
              <span className="block">
                Your favourite plant-based meals are ready to make life easier.
                Stock your freezer with our delicious frozen ready meals,
                perfect for those busy days when you want something comforting,
                tasty and easy.
              </span>
              <span className="block rounded-2xl border border-green/20 bg-paper/70 p-4 backdrop-blur-sm sm:p-5">
                <span className="block font-bold text-green">
                  Free delivery on all pre-sale orders!
                </span>
                <span className="mt-0.5 block text-sm text-ink-soft">
                  Regular delivery fee is{" "}
                  {formatPriceShort(DELIVERY.northIsland)}.
                </span>
                <span className="mt-3 block border-t border-line pt-3 text-sm">
                  Order by{" "}
                  <strong className="font-bold text-ink">
                    {PRE_SALE.orderBy}
                  </strong>{" "}
                  and we&apos;ll deliver{" "}
                  <strong className="font-bold text-ink">
                    {PRE_SALE.deliveredBy}
                  </strong>
                  .
                </span>
              </span>
            </>
          ) : (
            <>
              No FOMO, no compromise — because{" "}
              <em className="not-italic text-green">
                doing good should taste incredible.
              </em>
            </>
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.5}>
            <Link
              href={PRE_SALE.active ? "/buy-now" : "/products"}
              data-cursor="Let's cook"
              className="group inline-flex items-center gap-2 rounded-full bg-green px-8 py-4 text-base font-semibold text-cream"
            >
              {PRE_SALE.active ? "Check out the range and order" : "Explore the range"}
              <ArrowDown
                size={18}
                className={`transition-transform ${
                  PRE_SALE.active
                    ? "-rotate-90 group-hover:translate-x-1"
                    : "group-hover:translate-y-1"
                }`}
              />
            </Link>
          </Magnetic>
          <Magnetic strength={0.5}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-green/30 px-8 py-4 text-base font-semibold text-green"
            >
              Our story
            </Link>
          </Magnetic>
        </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-7 z-20 mx-auto flex w-full max-w-7xl items-center px-5 text-xs uppercase tracking-[0.2em] text-ink-soft sm:px-8"
      >
        <span className="flex items-center gap-2">
          <ArrowDown size={14} className="animate-bounce" /> Scroll to taste
        </span>
      </motion.div>
    </section>
  );
}

function Line({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`block ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Floater({
  src,
  className,
  depth,
  delay,
  rotate,
  progress,
  index,
}: Floater & { progress: MotionValue<number>; index: number }) {
  const y = useTransform(progress, [0, 1], [0, depth]);
  // Spin each product as the hero scrolls away — alternating directions.
  const spin = index % 2 ? -110 : 95;
  const rot = useTransform(progress, [0, 1], [rotate, rotate + spin]);
  return (
    <motion.div
      style={{ y, rotate: rot }}
      className={`pointer-events-none absolute z-10 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
          className="drop-shadow-[0_30px_40px_rgba(20,66,44,0.25)]"
        >
          <Image
            src={src}
            alt=""
            width={400}
            height={400}
            className="h-auto w-full"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
