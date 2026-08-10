import type { Metadata } from "next";
import Image from "next/image";
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
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { RevealImage } from "@/components/RevealImage";
import { ScrollProgress } from "@/components/ScrollProgress";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

/**
 * Author headshots keyed by the name printed on the post. A writer with no
 * portrait here still gets the initials monogram, so adding a guest byline
 * needs no change to this page.
 */
const AUTHOR_PHOTOS: Record<string, string> = {
  "Alice Shopland": "/images/founder-avatar.webp",
};

/**
 * Round byline portrait. The image is decorative — the author's name is always
 * printed next to it — so the alt stays empty rather than repeating the name to
 * a screen reader.
 */
function AuthorAvatar({
  author,
  size,
  className,
}: {
  author: string;
  size: number;
  className?: string;
}) {
  const photo = AUTHOR_PHOTOS[author];

  return (
    <span
      style={{ width: size, height: size }}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-green font-display font-bold text-cream ${
        className ?? ""
      }`}
    >
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        authorInitials(author)
      )}
    </span>
  );
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
          <Breadcrumbs
            className="mb-5"
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Blog", path: BLOG_BASE_PATH },
              { name: post.title, path: `${BLOG_BASE_PATH}/${post.slug}` },
            ]}
          />
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

            <h1 className="mt-6 text-balance font-display text-[clamp(2.3rem,6vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
              {post.title}
            </h1>

            <p className="mt-6 text-pretty text-[1.25rem] leading-[1.6] text-ink-soft sm:text-[1.375rem]">
              {post.description}
            </p>

            {/* Byline */}
            <div className="mt-9 flex items-center gap-4 border-y border-line py-5">
              <AuthorAvatar author={post.author} size={44} className="text-sm" />
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

        {/* Hero. Held to the headline measure rather than run wide: every post
            image is a square crop off social, so a wide 16:10 frame threw away
            most of the picture and then upscaled what was left. A 4:3 frame at
            this width keeps the subject and stays inside the source's own
            resolution. The caption is wrapped with it so the markup is a real
            figure/figcaption pair. */}
        <figure className="mx-auto mt-12 max-w-3xl px-5 sm:px-8">
          <RevealImage
            src={post.image}
            alt={post.imageAlt}
            className="aspect-[4/3]"
            rounded="rounded-[1.75rem]"
            sizes="(max-width: 768px) 100vw, 704px"
            parallax={0}
            unoptimized
            priority
          />
          {post.caption && (
            <figcaption className="mt-5 border-l-2 border-gold/60 pl-4 text-sm leading-relaxed text-ink-soft/80">
              {post.caption}
            </figcaption>
          )}
        </figure>

        {/* Body */}
        <div className="mx-auto mt-16 max-w-[43rem] px-5 sm:px-8">
          <BlogBody blocks={post.body} />
        </div>

        {/* Author card */}
        <div className="mx-auto mt-16 max-w-[43rem] px-5 sm:px-8">
          <div className="flex flex-col gap-5 rounded-[1.75rem] border border-line bg-paper p-7 sm:flex-row sm:items-center sm:p-8">
            <AuthorAvatar author={post.author} size={64} className="text-lg" />
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
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-green/30"
                >
                  <span className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-line bg-cream-deep">
                    <Image
                      src={previous.cardImage}
                      alt=""
                      fill
                      unoptimized
                      sizes="72px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">
                      <ArrowLeft size={13} /> Previous
                    </span>
                    <span className="mt-1.5 block text-pretty font-display font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-green">
                      {previous.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`${BLOG_BASE_PATH}/${next.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-4 text-right transition-colors hover:border-green/30 sm:col-start-2"
                >
                  <span className="order-2 relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-line bg-cream-deep">
                    <Image
                      src={next.cardImage}
                      alt=""
                      fill
                      unoptimized
                      sizes="72px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </span>
                  <span className="order-1 ml-auto min-w-0">
                    <span className="flex items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">
                      Next <ArrowRight size={13} />
                    </span>
                    <span className="mt-1.5 block text-pretty font-display font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-green">
                      {next.title}
                    </span>
                  </span>
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
