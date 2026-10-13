"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/config";
import type { CardData } from "@/lib/search";
import type { ColourItem } from "@/lib/colours";
import SearchOverlay from "./SearchOverlay";
import ProductCard from "./ProductCard";
import ColoursPanel from "./ColoursPanel";

type Opt = { slug: string; label: string };
type Props = { d: Record<string, string>; seating: Opt[]; featured: CardData[]; colours: ColourItem[] };
type PanelName = "models" | "colours" | "search";

// Panels only fade. Nothing slides or resizes, so the page underneath never jumps.
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.18 } };

export default function Header({ d, seating, featured, colours }: Props) {
  const [panel, setPanel] = useState<PanelName | null>(null);
  const pathname = usePathname();

  useEffect(() => setPanel(null), [pathname]);
  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [panel]);

  const closeOnLink = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) setPanel(null);
  };
  const toggle = (p: PanelName) => setPanel((v) => (v === p ? null : p));
  const nav = "flex min-h-[38px] items-center rounded-none px-2.5 text-xs font-medium transition-colors focus:outline-none focus:ring-0 sm:min-h-[44px] sm:px-4 sm:text-sm";
  const on = "bg-gold text-ink font-semibold";
  const off = "text-ivory hover:bg-ivory/10";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-6 sm:pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-1.5 rounded-none border border-ivory/10 bg-ink/80 py-1 pl-3.5 pr-1 backdrop-blur-xl sm:py-1.5 sm:pl-6 sm:pr-1.5">
          <Link href="/" className="font-display truncate text-lg tracking-wide text-ivory focus:outline-none sm:text-2xl" aria-label={site.name}>
            {site.name}
          </Link>
          <nav className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => toggle("search")} aria-label={d.search} aria-expanded={panel === "search"}
              className={`grid h-9 w-9 place-items-center rounded-none transition-colors focus:outline-none focus:ring-0 sm:h-11 sm:w-11 ${panel === "search" ? on : off}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={() => toggle("models")} aria-expanded={panel === "models"} aria-controls="models-panel"
              className={`${nav} ${panel === "models" ? on : off}`}
            >
              {d.models}
            </button>

            <button
              onClick={() => toggle("colours")} aria-expanded={panel === "colours"} aria-controls="colours-panel"
              className={`${nav} ${panel === "colours" ? on : off}`}
            >
              {d.colours}
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel} id={panel === "search" ? undefined : `${panel}-panel`} role="dialog"
            aria-label={panel === "models" ? d.models : panel === "colours" ? d.colours : d.search}
            {...fade} onClick={closeOnLink}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-ink/95 backdrop-blur-2xl"
          >
            {panel === "search" && <SearchOverlay d={d} />}
            {panel === "colours" && <ColoursPanel d={d} colours={colours} />}
            {panel === "models" && (
              <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-20 sm:gap-10 sm:px-8 sm:pb-20 sm:pt-36 lg:grid-cols-[380px_1fr]">
                <div>
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-sand">{d.findFit}</p>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    {seating.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/models/${c.slug}`}
                          className="group relative flex min-h-[50px] items-center justify-between overflow-hidden rounded-none border border-ivory/20 bg-ivory/5 px-4 text-ivory backdrop-blur-md transition-all duration-500 ease-out hover:border-ivory hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] sm:min-h-[58px] sm:px-5 lg:min-h-[64px]"
                        >
                          <span className="absolute inset-0 translate-y-[102%] bg-gradient-to-r from-ivory via-white to-ivory transition-transform duration-500 ease-out group-hover:translate-y-0 group-active:translate-y-0" />
                          <span className="font-heavy relative z-10 text-lg tracking-tight transition-colors duration-300 group-hover:text-ink group-active:text-ink sm:text-xl lg:text-2xl">
                            {c.label}
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            className="relative z-10 h-4 w-4 transition-colors duration-300 group-hover:text-ink group-active:text-ink sm:h-5 sm:w-5"
                            fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                    <Link
                      href="/models"
                      className="group relative flex min-h-[44px] items-center justify-center overflow-hidden rounded-none border border-ivory/20 bg-ivory/5 px-5 text-xs font-semibold text-ivory backdrop-blur-md transition-all duration-500 ease-out hover:border-ivory hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] sm:min-h-[48px] sm:px-6 sm:text-sm"
                    >
                      <span className="absolute inset-0 translate-y-[102%] bg-gradient-to-r from-ivory via-white to-ivory transition-transform duration-500 ease-out group-hover:translate-y-0 group-active:translate-y-0" />
                      <span className="relative z-10 transition-colors duration-300 group-hover:text-ink group-active:text-ink">{d.allModels}</span>
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-sand">{d.popular}</p>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
                    {featured.slice(0, 3).map((f, i) => (
                      <div key={f.slug} className={i === 2 ? "hidden sm:block" : "block"}>
                        <ProductCard p={f} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}