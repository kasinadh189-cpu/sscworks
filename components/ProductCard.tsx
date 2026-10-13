"use client";

import Image from "next/image";
import Link from "next/link";
import { lab, seatingTypes, upholsteries } from "@/lib/config";
import { dict } from "@/lib/dict";
import type { CardData } from "@/lib/search";
import Placeholder from "./Placeholder";

export default function ProductCard({
  p,
  priority = false,
}: {
  p: CardData;
  priority?: boolean;
}) {
  const name = typeof p.name === "object" ? p.name.en : p.name;
  const d = dict.en;

  // Primary image & hover image fallback logic
  const primaryImage = p.image || p.images?.[0];
  const hoverImage = p.imageHover || p.images?.[1] || primaryImage;

  // Format Material (Cloth/Upholstery) & Color Swatch label
  const materialText =
    typeof p.material === "object"
      ? p.material.en
      : p.material
      ? p.material
      : p.upholstery?.[0]
      ? lab(upholsteries, p.upholstery[0], "en")
      : lab(seatingTypes, p.seating, "en");

  const colorText =
    typeof p.color === "object" ? p.color.en : p.color || "";

  const metaText = [colorText, materialText].filter(Boolean).join("  ·  ");

  return (
    <Link href={`/product/${p.slug}`} className="group block">
      {/* 1:1 Square Frame with Image Cross-Fade */}
      <div className="surface relative aspect-square w-full overflow-hidden rounded-none border border-ivory/10 bg-coal/50 backdrop-blur-md">
        {primaryImage ? (
          <>
            {/* Primary Main Image */}
            <Image
              src={primaryImage}
              alt={name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 45vw, 30vw"
              className={`object-cover object-center transition-all duration-700 ease-out ${
                hoverImage && hoverImage !== primaryImage
                  ? "opacity-100 group-hover:scale-105 group-hover:opacity-0"
                  : "group-hover:scale-105"
              }`}
            />

            {/* Secondary Image (Cross-fades on hover) */}
            {hoverImage && hoverImage !== primaryImage && (
              <Image
                src={hoverImage}
                alt={`${name} secondary view`}
                fill
                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <Placeholder seed={p.slug} label={name} />
        )}

        {/* Ambient Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />

        {/* Straight-Edged Gold Badge */}
        {p.badge && p.badge !== "none" && (
          <span className="absolute left-3 top-3 z-10 flex min-h-[26px] items-center rounded-none bg-gold px-3 text-[10px] font-bold uppercase tracking-wider text-ink shadow-[0_4px_12px_rgba(200,169,107,0.35)]">
            {p.badge === "bestseller" ? d.badgeBestseller : d.badgeNew}
          </span>
        )}
      </div>

      {/* Footer Content: Title (Inter Tight 500), Color & Material */}
      <div className="pt-3">
        <h3 
          className="text-base leading-tight tracking-tight text-ivory transition-colors duration-300 group-hover:text-gold sm:text-lg"
          style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 500 }}
        >
          {name}
        </h3>
        {metaText && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-sand/80">
            {metaText}
          </p>
        )}
      </div>
    </Link>
  );
}