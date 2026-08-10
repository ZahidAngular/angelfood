import type { Metadata } from "next";
import { BlogCard, BlogFeaturedCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema } from "@/lib/schema";
import { BLOG_BASE_PATH, getBlogPosts } from "@/lib/blog";

const DESCRIPTION =
  "Vegan food ideas, tips and inspiration from Alice Shopland — sandwiches, pizza, pasta, cheeseboards and more.";

export const metadata: Metadata = {
  title: "Alice’s Vegan Food Blog — Angel Food",
  description: DESCRIPTION,
  alternates: { canonical: BLOG_BASE_PATH },
  openGraph: {
    url: BLOG_BASE_PATH,
    title: "Alice’s Vegan Food Blog — Angel Food",
    description: DESCRIPTION,
  },
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <main>
      <JsonLd
        data={itemListSchema({
          name: "Alice's vegan food blog",
          url: BLOG_BASE_PATH,
          items: posts.map((post) => ({
            name: post.title,
            path: `${BLOG_BASE_PATH}/${post.slug}`,
          })),
        })}
      />
      {/* Masthead */}
      <header className="relative overflow-hidden border-b border-line bg-cream pb-14 pt-40 sm:pb-16 sm:pt-48">
        <div className="pointer-events-none absolute -right-40 -top-16 h-[30rem] w-[30rem] rounded-full bg-gold/20 blur-[130px]" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal y={16}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
              ✦ Alice’s vegan food blog
            </p>
            <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <h1 className="max-w-3xl font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-ink">
                Food ideas worth sharing.
              </h1>
              <p className="max-w-sm text-lg leading-relaxed text-ink-soft">
                Tips, inspiration and plant-based know-how from Alice Shopland —
                written for real kitchens and real weeknights.
              </p>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Lead story */}
      <section className="bg-cream pb-16 pt-16 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <BlogFeaturedCard post={featured} />
        </div>
      </section>

      {/* The rest */}
      {rest.length > 0 && (
        <section className="border-t border-line bg-cream pb-24 pt-16 sm:pb-32 sm:pt-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal y={16}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft/70">
                More stories
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
