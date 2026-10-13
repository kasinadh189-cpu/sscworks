"use client";

import Link from "next/link";
import { useState } from "react";
import type { ColourItem, Tone } from "@/lib/colours";

const TONES: Tone[] = ["dark", "light", "neutral", "warm", "cool"];
const toneLabel: Record<Tone, string> = {
  dark: "tDark",
  light: "tLight",
  neutral: "tNeutral",
  warm: "tWarm",
  cool: "tCool",
};

// Light text on dark colours, dark text on light colours
function textOn(key: string) {
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(key.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return lum > 0.38 ? "#0c0a08" : "#f4f7fc";
}

export default function ColoursPanel({
  d,
  colours,
}: {
  d: Record<string, string>;
  colours: ColourItem[];
}) {
  const [tone, setTone] = useState<Tone | "all">("all");
  const present = TONES.filter((t) => colours.some((c) => c.tones.includes(t)));
  const list =
    tone === "all" ? colours : colours.filter((c) => c.tones.includes(tone));

  // Chunky Hero-Scale Filter Chips with White Fluid Wave Sweep & Ambient Glow
  const chip = (on: boolean) =>
    `group relative flex min-h-[54px] shrink-0 items-center justify-center overflow-hidden rounded-none border px-7 py-3 text-base font-semibold tracking-wide backdrop-blur-md transition-all duration-500 ease-out active:scale-[0.98] sm:min-h-[58px] sm:px-8 sm:text-lg ${
      on
        ? "border-gold bg-gold text-ink shadow-[0_0_25px_rgba(200,169,107,0.45)]"
        : "border-ivory/25 bg-ivory/5 text-ivory hover:border-ivory hover:shadow-[0_0_35px_rgba(255,255,255,0.35)]"
    }`;

  const chipWave = (on: boolean) =>
    on ? null : (
      <span className="absolute inset-0 translate-y-full rounded-none bg-gradient-to-r from-ivory via-white to-ivory transition-transform duration-500 ease-out group-hover:translate-y-0 group-active:translate-y-0" />
    );

  const chipText =
    "relative z-10 transition-colors duration-300 group-hover:text-ink group-active:text-ink";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
      <p className="text-xs font-semibold uppercase tracking-wider text-sand">
        {d.colours}
      </p>
      <p className="mt-2 max-w-md text-sand">{d.pickColour}</p>

      {colours.length > 0 ? (
        <>
          {/* Tone Filter Chips */}
          <div className="no-scrollbar -mx-5 mt-6 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {(["all", ...present] as (Tone | "all")[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                aria-pressed={tone === t}
                className={chip(tone === t)}
              >
                {chipWave(tone === t)}
                <span className={chipText}>
                  {t === "all" ? d.tAll : d[toneLabel[t]]}
                </span>
              </button>
            ))}
          </div>

          {/* Rectangular Solid Colour Tiles (aspect-[16/10]) with Massive Text Zoom */}
          <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {list.map((c) => {
              const colourLabel =
                typeof c.name === "string" ? c.name : c.name.en;

              return (
                <Link
                  key={c.key}
                  href={`/models?colour=${c.key}`}
                  style={{
                    backgroundColor: c.hex,
                    ["--fg" as string]: textOn(c.key),
                  }}
                  className="group relative flex aspect-[16/10] w-full flex-col items-center justify-center overflow-hidden rounded-none border border-ivory/15 p-4 text-center transition-colors duration-300 hover:border-transparent"
                >
                  {/* Ultra-Large Color Name: Starts at text-3xl / opacity-60, zooms (135%) & thickens to bold opacity-100 */}
                  <span
                    className="relative z-10 block text-3xl leading-none tracking-tight opacity-60 text-[color:var(--fg)] transition-all duration-500 ease-out group-hover:scale-135 group-hover:font-bold group-hover:opacity-100 sm:text-4xl"
                    style={{
                      fontFamily: "var(--font-inter-tight), sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {colourLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <p className="mt-6 max-w-md text-sand">{d.noColours}</p>
      )}
    </div>
  );
}