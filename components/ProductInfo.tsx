"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { productMsg, waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

type Props = {
  d: Record<string, string>;
  name: string;
  nameEn: string;
  code: string;
  url: string;
  tagline: string;
  features: string[];
  meta: string[];
  images?: string[];
  swatches: { label: string; en: string; hex?: string; image?: string }[];
  customSize: boolean;
};

export default function ProductInfo({
  d,
  name,
  nameEn,
  code,
  url,
  tagline,
  features,
  meta,
  images = [],
  swatches,
  customSize,
}: Props) {
  const [sel, setSel] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const selectedSwatch = swatches[sel];
  const rawImage = images[0] || selectedSwatch?.image;

  // Convert relative image path to an absolute URL so WhatsApp triggers a rich preview
  const absoluteImageUrl =
    typeof window !== "undefined" && rawImage?.startsWith("/")
      ? `${window.location.origin}${rawImage}`
      : rawImage;

  const msg = productMsg({
    name: nameEn,
    code,
    url,
    colour: selectedSwatch?.en,
    imageUrl: absoluteImageUrl,
  });

  const customMsg = productMsg({
    name: nameEn,
    code,
    url,
    colour: selectedSwatch?.en,
    imageUrl: absoluteImageUrl,
    extra: "I'd like a custom size.",
  });

  return (
    <div className="space-y-6">
      {/* Product Header Block */}
      <div>
        <p className="font-[family-name:var(--font-inter-tight)] text-xs font-semibold uppercase tracking-widest text-sand/80 sm:text-sm">
          {meta.join("  ·  ")}
        </p>

        <h1 className="font-heavy mt-1.5 text-[clamp(2.5rem,8vw,4.25rem)] leading-[1.02] tracking-tight text-ivory">
          {name}
        </h1>

        {tagline && (
          <p className="mt-2.5 font-sans text-base text-sand sm:text-lg sm:leading-relaxed">
            {tagline}
          </p>
        )}
      </div>

      {/* Feature List */}
      {features.length > 0 && (
        <ul className="space-y-2.5 font-sans text-sm text-ivory/90 sm:text-base">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-none bg-gold shadow-[0_0_8px_rgba(200,169,107,0.6)]" />
              <span className="leading-normal">{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Ultra-Smooth Expand-On-Hover Color Selector */}
      {swatches.length > 0 && (
        <div className="pt-2">
          <p className="font-[family-name:var(--font-inter-tight)] text-xs font-bold uppercase tracking-wider text-sand">
            {d.colours || "Colours"}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-2">
            {swatches.map((s, n) => {
              const isSelected = n === sel;
              const isHovered = hovered === n;

              return (
                <motion.button
                  key={s.en + n}
                  layout
                  type="button"
                  onClick={() => setSel(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(null)}
                  transition={{
                    layout: { type: "spring", stiffness: 320, damping: 28 },
                  }}
                  className={`group relative flex h-10 cursor-pointer items-center overflow-hidden border transition-colors duration-300 ${
                    isSelected
                      ? "border-gold shadow-[0_0_12px_rgba(200,169,107,0.35)]"
                      : "border-ivory/20 bg-coal/40 hover:border-ivory/60"
                  }`}
                >
                  {/* Fixed Aspect Swatch Image Box */}
                  <span
                    className="h-full w-10 shrink-0 bg-cover bg-center"
                    style={{
                      backgroundColor: s.hex ?? "#444",
                      backgroundImage: s.image ? `url(${s.image})` : undefined,
                    }}
                  />

                  {/* Silky-Smooth Slide Out Text Mask */}
                  <AnimatePresence initial={false}>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{
                          width: { type: "spring", stiffness: 320, damping: 28 },
                          opacity: { duration: 0.15 },
                        }}
                        className="overflow-hidden"
                      >
                        <span className="block whitespace-nowrap border-l border-ivory/15 px-3 font-[family-name:var(--font-inter-tight)] text-xs font-bold uppercase tracking-wider text-ivory">
                          {s.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Stacked Full-Width WhatsApp Action Buttons */}
      <div className="hidden flex-col gap-2.5 pt-2 md:flex w-full">
        {/* Primary Enquire Button */}
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex min-h-[56px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-none bg-ivory px-6 text-xs font-bold uppercase tracking-wider text-ink transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] active:scale-95"
        >
          <span className="absolute inset-0 translate-y-[102%] rounded-none bg-gradient-to-r from-gold via-ivory to-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
          <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-ink">
            <WhatsAppIcon className="h-5 w-5" />
            {d.askAbout}
          </span>
        </a>

        {/* Custom Size Request Button Stacked Below */}
        {customSize && (
          <a
            href={waLink(customMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[56px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-none border border-ivory/25 bg-ivory/5 px-6 text-xs font-bold uppercase tracking-wider text-ivory backdrop-blur-md transition-all duration-500 ease-out hover:scale-[1.01] hover:border-ivory hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95"
          >
            <span className="absolute inset-0 translate-y-[102%] rounded-none bg-gradient-to-r from-ivory via-white to-ivory transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-ink">
              <WhatsAppIcon className="h-5 w-5" />
              {d.askCustom}
            </span>
          </a>
        )}
      </div>

      {/* Mobile Sticky Floating CTA */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-ink/90 px-4 pb-3 pt-3 backdrop-blur-xl md:hidden">
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex min-h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-none bg-ivory px-6 text-xs font-bold uppercase tracking-wider text-ink transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95"
        >
          <span className="absolute inset-0 translate-y-[102%] rounded-none bg-gradient-to-r from-gold via-ivory to-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
          <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-ink">
            <WhatsAppIcon className="h-5 w-5" />
            {d.askAbout}
          </span>
        </a>
      </div>
    </div>
  );
}