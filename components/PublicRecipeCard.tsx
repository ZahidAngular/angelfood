"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";
import { resolveImageUrl, type Recipe } from "@/lib/api";
import { Reveal } from "./Reveal";

export function PublicRecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const image = resolveImageUrl(recipe.imageUrl);

  return (
    <Reveal delay={(index % 4) * 0.07}>
      <Link href={`/recipes/${recipe.id}`} className="group block" data-cursor="Cook this">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-cream-deep"
        >
          {image ? (
            <Image
              src={image}
              alt={recipe.title}
              fill
              unoptimized
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-soft/40">
              <ImagePlus size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-cream">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="mt-1 max-h-0 overflow-hidden text-sm text-cream/85 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                {recipe.description}
              </p>
            )}
          </div>
        </motion.div>
      </Link>
    </Reveal>
  );
}
