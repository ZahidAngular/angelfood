"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { SocialLinks } from "./SocialIcons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8 ${
            scrolled
              ? "my-3 rounded-full border border-line/70 bg-cream/85 py-3 shadow-[0_10px_40px_-20px_rgba(20,66,44,0.5)] backdrop-blur-xl"
              : "my-6 py-4"
          }`}
        >
          <Link href="/" aria-label="Angel Food — home" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Angel Food"
              width={120}
              height={120}
              priority
              className={`w-auto transition-all duration-500 dark:[filter:brightness(0)_invert(1)] ${
                scrolled ? "h-16" : "h-24"
              }`}
            />
          </Link>

          <nav
            className={`hidden items-center transition-all duration-500 md:flex ${
              scrolled ? "gap-8" : "gap-10"
            }`}
          >
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative font-medium transition-all duration-500 hover:text-accent ${
                    scrolled ? "text-sm" : "text-base"
                  } ${active ? "text-accent" : "text-ink-soft"}`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-green transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 lg:flex">
              <SocialLinks
                size={16}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-deep hover:text-accent"
              />
            </div>
            <Link
              href="/where-to-buy"
              className={`hidden rounded-full bg-green font-semibold text-cream transition-all duration-500 hover:scale-[1.04] sm:inline-flex ${
                scrolled ? "px-5 py-2.5 text-sm" : "px-6 py-3 text-base"
              }`}
            >
              Find a store
            </Link>
            <button
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-accent transition-colors hover:bg-paper"
            >
              <ShoppingBag size={18} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink-on-accent">
                0
              </span>
            </button>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-accent md:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-green px-6 py-6 text-cream md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-extrabold">
                Angel<span className="text-gold">Food</span>
              </span>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/30"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mt-16 flex flex-col gap-2">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl font-bold tracking-tight"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-5">
              <div className="flex gap-3">
                <SocialLinks
                  size={18}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-gold hover:text-ink-on-accent"
                />
              </div>
              <Link
                href="/where-to-buy"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gold px-6 py-4 text-center text-base font-semibold text-ink-on-accent"
              >
                Find a store near you
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
