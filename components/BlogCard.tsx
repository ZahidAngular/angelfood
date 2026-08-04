"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  BLOG_BASE_PATH,
  formatBlogDateLong,
  readingTime,
  type BlogPost,
} from "@/lib/blog";
import { Reveal } from "./Reveal";

/** Small pill used for the topic chip on cards and post headers. */
export function CategoryChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-green/20 bg-green/[0.06] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green">
      {label}
    </span>
  );
}

/**
 * Standard blog card — image, topic chip, headline and a byline row. Used for
 * the index grid and the "more from the blog" strip.
 */
export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <article className="h-full">
        <Link
          href={`${BLOG_BASE_PATH}/${post.slug}`}
          className="group flex h-full flex-col"
          data-cursor="Read"
        >
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-line bg-cream-deep"
          >
            <Image
              src={post.cardImage}
              alt={post.imageAlt}
              fill
              unoptimized
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center rounded-full bg-paper/95 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-green backdrop-blur">
                {post.category}
              </span>
            </div>
          </motion.div>

          <h3 className="mt-6 font-display text-[1.4rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink transition-colors group-hover:text-green">
            {post.title}
          </h3>

          <p className="mt-3 line-clamp-3 leading-relaxed text-ink-soft">
            {post.description}
          </p>

          <div className="mt-5 flex items-center gap-2.5 border-t border-line pt-4 text-[0.8rem] text-ink-soft/80">
            <span>{formatBlogDateLong(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-ink-soft/30" />
            <span>{readingTime(post)} min read</span>
            <ArrowUpRight
              size={16}
              className="ml-auto text-green opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </div>
        </Link>
      </article>
    </Reveal>
  );
}

/**
 * Oversized lead card for the newest post — split image/text layout that gives
 * the index a clear entry point instead of four equal tiles.
 */
export function BlogFeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Reveal>
      <article>
        <Link
          href={`${BLOG_BASE_PATH}/${post.slug}`}
          className="group grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14"
          data-cursor="Read"
        >
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line bg-cream-deep lg:aspect-[16/11]"
          >
            <Image
              src={post.cardImage}
              alt={post.imageAlt}
              fill
              unoptimized
              priority
              sizes="(max-width:1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            />
          </motion.div>

          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-coral px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-cream">
                Latest
              </span>
              <CategoryChip label={post.category} />
            </div>

            <h2 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.25rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink transition-colors group-hover:text-green">
              {post.title}
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              {post.description}
            </p>

            <div className="mt-7 flex items-center gap-2.5 text-sm text-ink-soft/80">
              <span className="font-medium text-ink">{post.author}</span>
              <span className="h-1 w-1 rounded-full bg-ink-soft/30" />
              <span>{formatBlogDateLong(post.date)}</span>
              <span className="h-1 w-1 rounded-full bg-ink-soft/30" />
              <span>{readingTime(post)} min read</span>
            </div>

            <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-green px-7 py-3.5 font-semibold text-cream transition-transform duration-300 group-hover:scale-[1.04]">
              Read the post <ArrowUpRight size={17} />
            </span>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
