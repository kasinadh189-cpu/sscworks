import { lab, seatingTypes, styles, upholsteries, type L } from "./config";
import { hexKey, isHexKey } from "./colours";
import type { Product } from "./products";

// Slim shape sent to the browser: keeps pages light even with hundreds of models.
export type CardData = {
  slug: string;
  code: string;
  name: L;
  tagline: L;
  seating: string;
  style: string;
  upholstery: string[];
  colours: { k: string; n: L }[];
  image?: string;
  imageHover?: string;
  images?: string[];
  material?: string | L;
  color?: string | L;
  badge: "none" | "bestseller" | "new";
};

export const toCard = (p: Product): CardData => ({
  slug: p.slug,
  code: p.code,
  name: p.name,
  tagline: p.tagline,
  seating: p.seating,
  style: p.style,
  upholstery: p.upholstery,
  colours: p.swatches.map((s) => ({ k: hexKey(s.hex), n: s.name })).filter((c) => isHexKey(c.k)),
  image: p.images?.[0],
  imageHover: p.images?.[1] ?? p.images?.[0],
  images: p.images,
  material: p.material ?? p.upholstery?.[0],
  color: p.color,
  badge: p.badge,
});

export function haystack(c: CardData): string {
  return [
    c.name.en,
    c.code,
    c.tagline.en,
    lab(seatingTypes, c.seating, "en"),
    lab(styles, c.style, "en"),
    ...c.upholstery.map((u) => lab(upholsteries, u, "en")),
    ...c.colours.map((x) => x.n.en),
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesQuery(c: CardData, q: string): boolean {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const h = haystack(c);
  return words.every((w) => h.includes(w));
}