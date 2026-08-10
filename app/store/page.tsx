import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema } from "@/lib/schema";
import { STORE_PRODUCTS } from "@/lib/store";

export const metadata: Metadata = {
  title: "Store — Angel Food",
  description:
    "Browse Angel Food dairy-free cheese products, then find your nearest stockist.",
  alternates: { canonical: "/store" },
};

export default function StorePage() {
  return (
    <main>
      <JsonLd
        data={itemListSchema({
          name: "Store",
          url: "/store",
          items: STORE_PRODUCTS.map((product) => ({
            name: product.name,
            path: `/store/p/${product.slug}`,
          })),
        })}
      />
      <PageHeader
        eyebrow="Store"
        title="Store."
        intro="Have a look at what we make, then find your nearest stockist."
      />
      <section className="bg-cream pb-24 pt-4 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {STORE_PRODUCTS.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 0.07}>
                <Link
                  href={`/store/p/${product.slug}`}
                  className="group block"
                  data-cursor="View"
                >
                  <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-paper">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      unoptimized
                      sizes="(max-width:1024px) 100vw, 33vw"
                      className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-green">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-ink-soft">{product.price}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
