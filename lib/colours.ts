import type { L } from "./config";
import type { Product } from "./products";

export type Tone = "dark" | "light" | "neutral" | "warm" | "cool";
export type ColourItem = { key: string; hex: string; name: L; count: number; tones: Tone[] };

export const hexKey = (hex?: string) => (hex ?? "").replace("#", "").trim().toLowerCase();
export const isHexKey = (k: string) => /^[0-9a-f]{6}$/.test(k);

function hsl(key: string) {
  const r = parseInt(key.slice(0, 2), 16) / 255;
  const g = parseInt(key.slice(2, 4), 16) / 255;
  const b = parseInt(key.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

// Works out Dark / Light / Neutral / Warm / Cool from the colour code itself
export function tonesOf(key: string): Tone[] {
  if (!isHexKey(key)) return [];
  const { h, s, l } = hsl(key);
  const t: Tone[] = [];
  if (l < 0.3) t.push("dark");
  if (l > 0.68) t.push("light");
  if (s < 0.14) t.push("neutral");
  else if (h < 70 || h >= 330) t.push("warm");
  else t.push("cool");
  return t;
}

export function buildColours(products: Product[]): ColourItem[] {
  const map = new Map<string, ColourItem>();
  for (const p of products) {
    const seen = new Set<string>();
    for (const s of p.swatches) {
      const key = hexKey(s.hex);
      if (!isHexKey(key) || seen.has(key)) continue;
      seen.add(key);
      const cur = map.get(key);
      if (cur) cur.count++;
      else map.set(key, { key, hex: `#${key}`, name: s.name, count: 1, tones: tonesOf(key) });
    }
  }
  // Darkest first, lightest last
  return [...map.values()].sort((a, b) => hsl(a.key).l - hsl(b.key).l);
} 