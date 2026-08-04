import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  BLOG_BASE_PATH,
  BLOG_POSTS,
  authorInitials,
  formatBlogDateLong,
  getBlogPost,
  getBlogPosts,
  readingTime,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { BlogBody } from "@/components/BlogBody";
import { BlogCard, CategoryChip } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";
import { RevealImage } from "@/components/RevealImage";
import { ScrollProgress } from "@/components/ScrollProgress";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const title = `${post.title} — ${SITE_NAME}`;
  const url = `${BLOG_BASE_PATH}/${post.slug}`;

  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const posts = getBlogPosts();
  const current = posts.findIndex((p) => p.slug === post.slug);
  const previous = current > 0 ? posts[current - 1] : null;
  const next = current < posts.length - 1 ? posts[current + 1] : null;
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [post.image],
    datePublished: post.date,
    articleSection: post.category,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}${BLOG_BASE_PATH}/${post.slug}`,
  };

  return (
    <main>
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="bg-cream pb-20 pt-36 sm:pt-44">
        {/* Headline block */}
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href={BLOG_BASE_PATH}
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-green"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            All posts
          </Link>

          <Reveal y={18}>
            <div className="mt-9">
              <CategoryChip label={post.category} />
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.3rem,6vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
              {post.title}
            </h1>

            <p className="mt-6 text-[1.25rem] leading-[1.6] text-ink-soft sm:text-[1.375rem]">
              {post.description}
            </p>

            {/* Byline */}
            <div className="mt-9 flex items-center gap-4 border-y border-line py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green font-display text-sm font-bold text-cream">
                {authorInitials(post.author)}
              </span>
              <div className="text-sm">
                <p className="font-semibold text-ink">{post.author}</p>
                <p className="mt-0.5 flex items-center gap-2 text-ink-soft/80">
                  <time dateTime={post.date}>
                    {formatBlogDateLong(post.date)}
                  </time>
                  <span className="h-1 w-1 rounded-full bg-ink-soft/30" />
                  <span>{readingTime(post)} min read</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Hero */}
        <div className="mx-auto mt-12 max-w-5xl px-5 sm:px-8">
          <RevealImage
            src={post.image}
            alt={post.imageAlt}
            className="aspect-[16/10]"
            rounded="rounded-[1.75rem]"
            sizes="(max-width: 1024px) 100vw, 1024px"
            unoptimized
            priority
          />
          {post.caption && (
            <figcaption className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-ink-soft/75">
              {post.caption}
            </figcaption>
          )}
        </div>

        {/* Body */}
        <div className="mx-auto mt-16 max-w-[43rem] px-5 sm:px-8">
          <BlogBody blocks={post.body} />
        </div>

        {/* Author card */}
        <div className="mx-auto mt-16 max-w-[43rem] px-5 sm:px-8">
          <div className="flex flex-col gap-5 rounded-[1.75rem] border border-line bg-paper p-7 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green font-display text-lg font-bold text-cream">
              {authorInitials(post.author)}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
                Written by
              </p>
              <p className="mt-1.5 font-display text-xl font-bold tracking-tight text-ink">
                {post.author}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Sharing plant-based food ideas, kitchen tips and everyday
                inspiration for the Angel Food community.
              </p>
            </div>
          </div>
        </div>

        {/* Previous / next */}
        {(previous || next) && (
          <nav className="mx-auto mt-12 max-w-[43rem] px-5 sm:px-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`${BLOG_BASE_PATH}/${previous.slug}`}
                  className="group rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-green/30"
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">
                    <ArrowLeft size={13} /> Previous
                  </span>
                  <p className="mt-2 font-display font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-green">
                    {previous.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`${BLOG_BASE_PATH}/${next.slug}`}
                  className="group rounded-2xl border border-line bg-paper p-5 text-right transition-colors hover:border-green/30 sm:col-start-2"
                >
                  <span className="flex items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">
                    Next <ArrowRight size={13} />
                  </span>
                  <p className="mt-2 font-display font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-green">
                    {next.title}
                  </p>
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line bg-cream-deep/50 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink sm:text-4xl">
                More from the blog.
              </h2>
              <Link
                href={BLOG_BASE_PATH}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.14em] text-green"
              >
                View all
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
