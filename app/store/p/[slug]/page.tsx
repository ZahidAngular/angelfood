import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { productSchema } from "@/lib/schema";
import { STORE_PRODUCTS, getStoreProduct } from "@/lib/store";

export function generateStaticParams() {
  return STORE_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getStoreProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} — Angel Food`,
    description: `${product.intro} ${product.usedFor.join(", ")}. ${product.format}.`,
    alternates: { canonical: `/store/p/${product.slug}` },
    openGraph: {
      url: `/store/p/${product.slug}`,
      title: `${product.name} — Angel Food`,
      images: [{ url: product.image, alt: product.imageAlt }],
    },
  };
}

export default async function StoreProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getStoreProduct(slug);
  if (!product) notFound();

  return (
    <main className="bg-cream pb-24 pt-36 sm:pb-32 sm:pt-44">
      <JsonLd
        data={productSchema({
          name: product.name,
          description: `${product.intro} ${product.usedFor.join(", ")}. ${product.format}.`,
          image: product.image,
          url: `/store/p/${product.slug}`,
          sku: product.productCode,
        })}
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Store", path: "/store" },
            { name: product.name, path: `/store/p/${product.slug}` },
          ]}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-paper">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-xl text-ink-soft">{product.price}</p>

            <p className="mt-8 leading-relaxed text-ink-soft">{product.intro}</p>
            <ul className="mt-4 space-y-2.5">
              {product.usedFor.map((use) => (
                <li key={use} className="relative pl-6 text-ink-soft">
                  <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold" />
                  {use}
                </li>
              ))}
            </ul>

            <dl className="mt-8 space-y-2 text-sm uppercase tracking-[0.14em] text-ink-soft">
              <div className="flex gap-2">
                <dt className="font-semibold text-ink">Format:</dt>
                <dd>{product.format}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-ink">Product code:</dt>
                <dd>{product.productCode}</dd>
              </div>
            </dl>

            <Link
              href="/where-to-buy"
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-green px-8 py-4 font-semibold text-cream transition-transform hover:scale-[1.04]"
            >
              <MapPin size={18} /> Find a stockist
            </Link>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
