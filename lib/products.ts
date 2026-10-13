import type { L } from "./config";

export type Swatch = { name: L; hex?: string; image?: string };
export type Product = {
  slug: string; code: string;
  name: L; tagline: L; description: L; features: L[];
  images: string[]; roomImages: string[];
  seating: string; style: string; upholstery: string[];
  size: { length?: number; depth?: number; height?: number; seatHeight?: number; note: L };
  frame: L; foam: L; base: L; swatches: Swatch[];
  customSize: boolean; customFabric: boolean; customNote: L;
  leadTime: L; assembly: boolean; warranty: L; care: L;
  badge: "none" | "bestseller" | "new"; madeToOrder: boolean; related: string[];
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

type RL = { en?: string; ml?: string } | null | undefined;
const loc = (v: RL): L => ({ en: v?.en ?? "", ml: v?.ml || v?.en || "" });

/* eslint-disable @typescript-eslint/no-explicit-any */
function fromSanity(r: any): Product {
  return {
    slug: r.slug, code: r.code ?? "",
    name: loc(r.name), tagline: loc(r.tagline), description: loc(r.description),
    features: (r.features ?? []).map(loc),
    images: (r.images ?? []).filter(Boolean),
    roomImages: (r.roomImages ?? (r.roomImage ? [r.roomImage] : [])).filter(Boolean),
    seating: r.seating ?? "3-seater", style: r.style ?? "modern", upholstery: r.upholstery ?? [],
    size: { length: r.length, depth: r.depth, height: r.height, seatHeight: r.seatHeight, note: loc(r.sizeNote) },
    frame: loc(r.frame), foam: loc(r.foam), base: loc(r.base),
    swatches: (r.swatches ?? []).map((s: any) => ({ name: loc(s.name), hex: s.hex || undefined, image: s.image || undefined })),
    customSize: !!r.customSize, customFabric: !!r.customFabric, customNote: loc(r.customNote),
    leadTime: loc(r.leadTime), assembly: r.assembly !== false, warranty: loc(r.warranty), care: loc(r.care),
    badge: r.badge === "bestseller" || r.badge === "new" ? r.badge : "none",
    madeToOrder: !!r.madeToOrder, related: (r.related ?? []).filter(Boolean),
  };
}

async function fetchSanity(): Promise<Product[]> {
  if (!projectId) return [];
  try {
    const q = `*[_type=="product" && !hidden && defined(slug.current)] | order(_createdAt desc) {
      "slug": slug.current, code, name, tagline, description, features,
      "images": images[].asset->url,
      "roomImages": roomImages[].asset->url, "roomImage": roomImage.asset->url,
      seating, style, upholstery, length, depth, height, seatHeight, sizeNote,
      frame, foam, base,
      "swatches": swatches[]{ name, hex, "image": image.asset->url },
      customSize, customFabric, customNote, leadTime, assembly, warranty, care, badge, madeToOrder,
      "related": related[]->slug.current
    }`;
    const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(q)}`;
    const res = await fetch(url, { next: { revalidate: 60, tags: ["products"] } });
    if (!res.ok) return [];
    const { result } = await res.json();
    return (result as any[]).map(fromSanity);
  } catch {
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  return fetchSanity();
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}