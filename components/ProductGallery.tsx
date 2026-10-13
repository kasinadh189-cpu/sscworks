"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Placeholder from "./Placeholder";

const Chevron = ({ dir }: { dir: "l" | "r" }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <path d={dir === "l" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

export default function ProductGallery({ images, name, slug }: { images: string[]; name: string; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const [i, setI] = useState(0);
  const slides = images.length ? images : [""];
  const last = slides.length - 1;

  useEffect(() => {
    thumbs.current[i]?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  }, [i]);

  const onScroll = () => {
    const el = ref.current;
    if (el) setI(Math.round(el.scrollLeft / el.clientWidth));
  };

  const go = (n: number) => {
    const el = ref.current;
    if (!el) return;
    const t = Math.max(0, Math.min(last, n));
    el.scrollTo({ left: t * el.clientWidth, behavior: "smooth" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(i - 1);
    if (e.key === "ArrowRight") go(i + 1);
  };

  const arrow =
    "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center border border-ivory/15 bg-ink/60 text-ivory backdrop-blur-md transition-all duration-200 hover:bg-ink/85 hover:border-ivory/30 sm:h-12 sm:w-12";

  return (
    <div onKeyDown={onKey} tabIndex={0} className="w-full outline-none">
      {/* Main Preview Frame (Larger & Taller) */}
      <div className="relative isolate overflow-hidden rounded-none border border-ivory/10 bg-coal">
        <div
          ref={ref}
          onScroll={onScroll}
          className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto sm:aspect-[16/10] lg:aspect-[16/11]"
        >
          {slides.map((src, n) => (
            <div key={n} className="relative h-full w-full shrink-0 snap-center snap-always overflow-hidden">
              {src ? (
                <Image
                  src={src}
                  alt={`${name} ${n + 1}`}
                  fill
                  priority={n === 0}
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover object-bottom"
                />
              ) : (
                <Placeholder seed={slug} label={name} />
              )}
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={() => go(i - 1)}
              aria-label="Previous photo"
              className={`${arrow} left-2.5 sm:left-4 ${i === 0 ? "pointer-events-none opacity-0" : "opacity-100"}`}
            >
              <Chevron dir="l" />
            </button>
            <button
              onClick={() => go(i + 1)}
              aria-label="Next photo"
              className={`${arrow} right-2.5 sm:right-4 ${i === last ? "pointer-events-none opacity-0" : "opacity-100"}`}
            >
              <Chevron dir="r" />
            </button>
            <span className="font-[family-name:var(--font-anton)] absolute right-3 top-3 z-10 bg-ink/70 px-3 py-1.5 text-xs tracking-wider text-ivory backdrop-blur-md sm:right-4 sm:top-4">
              {i + 1} / {slides.length}
            </span>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <>
          {/* Phone indicator dots */}
          <div className="mt-3 flex justify-center gap-2 sm:hidden" aria-hidden>
            {slides.map((_, n) => (
              <span
                key={n}
                className={`h-1.5 rounded-none transition-all duration-300 ${n === i ? "w-6 bg-gold" : "w-1.5 bg-ivory/30"}`}
              />
            ))}
          </div>

          {/* Desktop Thumbnails */}
          <div className="no-scrollbar mt-2 hidden gap-3 overflow-x-auto px-1 pb-1 pt-2 sm:flex">
            {slides.map(
              (src, n) =>
                src && (
                  <div key={src} className="flex shrink-0 flex-col items-center gap-1.5">
                    <button
                      ref={(el) => {
                        thumbs.current[n] = el;
                      }}
                      onClick={() => go(n)}
                      aria-label={`${name} ${n + 1}`}
                      aria-current={n === i}
                      className={`relative h-[72px] w-[108px] overflow-hidden rounded-none transition-all duration-300 ${
                        n === i
                          ? "opacity-100 ring-2 ring-gold ring-offset-2 ring-offset-ink"
                          : "opacity-50 hover:opacity-90"
                      }`}
                    >
                      <Image src={src} alt="" fill sizes="108px" className="object-cover" />
                    </button>
                    <span className={`h-[3px] rounded-none transition-all duration-300 ${n === i ? "w-8 bg-gold" : "w-0 bg-transparent"}`} />
                  </div>
                )
            )}
          </div>
        </>
      )}
    </div>
  );
}