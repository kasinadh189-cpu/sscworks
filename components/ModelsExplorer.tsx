"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { lab, seatingTypes, styles, upholsteries, type L } from "@/lib/config";
import { dict } from "@/lib/dict";
import { matchesQuery, type CardData } from "@/lib/search";
import { generalMsg } from "@/lib/whatsapp";
import ProductCard from "./ProductCard";
import WhatsAppButton from "./WhatsAppButton";

const PAGE = 12;

export default function ModelsExplorer({
  items,
  title,
  initialSeating = "",
}: {
  items: CardData[];
  title?: string;
  initialSeating?: string;
}) {
  const d = dict.en;
  const searchParams = useSearchParams();

  const [q, setQ] = useState("");
  const [seating, setSeating] = useState(initialSeating);
  const [style, setStyle] = useState("");
  const [fabric, setFabric] = useState("");
  const [colour, setColour] = useState("");
  const [shown, setShown] = useState(PAGE);

  const [showFilterBar, setShowFilterBar] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    const styleParam = searchParams.get("style") ?? "";
    const fabricParam = searchParams.get("fabric") ?? "";
    const colourParam = searchParams.get("colour") ?? "";
    const seatingParam = searchParams.get("seating") ?? initialSeating;

    setQ(qParam);
    setStyle(styleParam);
    setFabric(fabricParam);
    setColour(colourParam);
    setSeating(seatingParam);

    if (styleParam || fabricParam || colourParam || seatingParam) {
      setShowFilterBar(true);
    }
  }, [searchParams, initialSeating]);

  useEffect(() => {
    if (!openDropdown) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  const colourOpts = useMemo(() => {
    const m = new Map<string, L>();
    items.forEach((c) =>
      c.colours?.forEach((x) => {
        if (!m.has(x.k)) m.set(x.k, x.n);
      })
    );
    return [...m.entries()].map(([k, n]) => ({ k, n }));
  }, [items]);

  const list = useMemo(
    () =>
      items.filter(
        (c) =>
          (!seating || c.seating === seating) &&
          (!style || c.style === style) &&
          (!fabric || c.upholstery.includes(fabric)) &&
          (!colour || c.colours?.some((x) => x.k === colour)) &&
          matchesQuery(c, q)
      ),
    [items, seating, style, fabric, colour, q]
  );

  useEffect(() => setShown(PAGE), [seating, style, fabric, colour, q]);

  const rawColourObj = colourOpts.find((c) => c.k === colour)?.n;
  const colourName = rawColourObj ? (typeof rawColourObj === "string" ? rawColourObj : rawColourObj.en) : "";
  const heading =
    title ||
    (seating || colour
      ? `${[colourName, seating ? lab(seatingTypes, seating, "en") : ""].filter(Boolean).join(" ")} ${d.sofas}`
      : d.allModels);

  const activeCount = [seating, style, fabric, colour].filter(Boolean).length;
  const active = !!q || activeCount > 0;

  const clear = () => {
    setQ("");
    setSeating("");
    setStyle("");
    setFabric("");
    setColour("");
    setOpenDropdown(null);
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const filterBtnStyle = (isActive: boolean) =>
    `group relative flex min-h-[38px] sm:min-h-[42px] items-center gap-2 overflow-hidden rounded-none border px-4 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-500 ease-out active:scale-[0.98] ${
      isActive
        ? "border-ivory bg-ivory text-ink shadow-[0_0_25px_rgba(255,255,255,0.35)]"
        : "border-ivory/25 bg-ivory/5 text-ivory hover:border-ivory hover:shadow-[0_0_35px_rgba(255,255,255,0.35)]"
    }`;

  const filterBtnWave = (isActive: boolean) => (
    <span
      className={`absolute inset-0 translate-y-full rounded-none transition-transform duration-500 ease-out group-hover:translate-y-0 group-active:translate-y-0 ${
        isActive
          ? "bg-gradient-to-r from-gold via-ivory to-gold"
          : "bg-gradient-to-r from-ivory via-white to-ivory"
      }`}
    />
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-8 sm:pt-28">
      {/* Sticky Search & Filter Container */}
      <div
        ref={box}
        className="sticky top-[66px] z-30 -mx-3 rounded-none border border-ivory/10 bg-ink/90 p-2.5 backdrop-blur-xl sm:top-[88px] sm:mx-0 sm:p-3"
      >
        <div className="flex flex-col gap-2.5">
          {/* Search Input & Filter Toggle Trigger */}
          <div className="flex items-center gap-2">
            <div className="surface search-box flex flex-1 min-h-[38px] sm:min-h-[42px] items-center gap-2 rounded-none border border-ivory/20 bg-coal/40 px-3 py-1">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-sand" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={d.searchPlaceholder}
                aria-label={d.search}
                inputMode="search"
                autoComplete="off"
                className="w-full bg-transparent text-sm text-ivory placeholder:text-sand/60 focus:outline-none"
              />
              {active && (
                <button
                  onClick={clear}
                  className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-gold hover:underline"
                >
                  {d.clear}
                </button>
              )}
            </div>

            {/* Filter Toggle Trigger Button */}
            <button
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={filterBtnStyle(showFilterBar || activeCount > 0)}
              aria-expanded={showFilterBar}
            >
              {filterBtnWave(showFilterBar || activeCount > 0)}
              <svg viewBox="0 0 24 24" className="relative z-10 h-3.5 w-3.5 transition-colors duration-300 group-hover:text-ink" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              <span className="relative z-10 hidden transition-colors duration-300 group-hover:text-ink sm:inline">
                FILTER
              </span>
              {activeCount > 0 && (
                <span className="relative z-10 flex h-4 w-4 items-center justify-center bg-gold text-[10px] font-bold text-ink">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

          {/* Expandable Filter Drawer */}
          {showFilterBar && (
            <div className="flex flex-wrap items-center gap-2 border-t border-ivory/10 pt-2">
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("seating")}
                  aria-expanded={openDropdown === "seating"}
                  className={filterBtnStyle(!!seating || openDropdown === "seating")}
                >
                  {filterBtnWave(!!seating || openDropdown === "seating")}
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">{d.fSeating}</span>
                  <span className="relative z-10 text-[10px] transition-colors duration-300 group-hover:text-ink">▼</span>
                </button>

                {openDropdown === "seating" && (
                  <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-none border border-ivory/20 bg-coal/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-1.5">
                      {seatingTypes.map((o) => (
                        <button
                          key={o.slug}
                          onClick={() => {
                            setSeating(seating === o.slug ? "" : o.slug);
                            setOpenDropdown(null);
                          }}
                          className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                            seating === o.slug ? "bg-gold font-bold text-ink" : "text-ivory hover:bg-ivory/10"
                          }`}
                        >
                          {o.en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("style")}
                  aria-expanded={openDropdown === "style"}
                  className={filterBtnStyle(!!style || openDropdown === "style")}
                >
                  {filterBtnWave(!!style || openDropdown === "style")}
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">{d.fStyle}</span>
                  <span className="relative z-10 text-[10px] transition-colors duration-300 group-hover:text-ink">▼</span>
                </button>

                {openDropdown === "style" && (
                  <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-none border border-ivory/20 bg-coal/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-1.5">
                      {styles.map((o) => (
                        <button
                          key={o.slug}
                          onClick={() => {
                            setStyle(style === o.slug ? "" : o.slug);
                            setOpenDropdown(null);
                          }}
                          className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                            style === o.slug ? "bg-gold font-bold text-ink" : "text-ivory hover:bg-ivory/10"
                          }`}
                        >
                          {o.en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("fabric")}
                  aria-expanded={openDropdown === "fabric"}
                  className={filterBtnStyle(!!fabric || openDropdown === "fabric")}
                >
                  {filterBtnWave(!!fabric || openDropdown === "fabric")}
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">{d.fFabric}</span>
                  <span className="relative z-10 text-[10px] transition-colors duration-300 group-hover:text-ink">▼</span>
                </button>

                {openDropdown === "fabric" && (
                  <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-none border border-ivory/20 bg-coal/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-1.5">
                      {upholsteries.map((o) => (
                        <button
                          key={o.slug}
                          onClick={() => {
                            setFabric(fabric === o.slug ? "" : o.slug);
                            setOpenDropdown(null);
                          }}
                          className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                            fabric === o.slug ? "bg-gold font-bold text-ink" : "text-ivory hover:bg-ivory/10"
                          }`}
                        >
                          {o.en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {colourOpts.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("colour")}
                    aria-expanded={openDropdown === "colour"}
                    className={filterBtnStyle(!!colour || openDropdown === "colour")}
                  >
                    {filterBtnWave(!!colour || openDropdown === "colour")}
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">{d.colours}</span>
                    <span className="relative z-10 text-[10px] transition-colors duration-300 group-hover:text-ink">▼</span>
                  </button>

                  {openDropdown === "colour" && (
                    <div className="absolute left-0 top-full z-40 mt-2 max-h-72 w-64 overflow-y-auto rounded-none border border-ivory/20 bg-coal/95 p-3 shadow-2xl backdrop-blur-xl">
                      <div className="flex flex-col gap-1.5">
                        {colourOpts.map((o) => (
                          <button
                            key={o.k}
                            onClick={() => {
                              setColour(colour === o.k ? "" : o.k);
                              setOpenDropdown(null);
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                              colour === o.k ? "bg-gold font-bold text-ink" : "text-ivory hover:bg-ivory/10"
                            }`}
                          >
                            <span className="h-3.5 w-3.5 shrink-0 border border-ivory/40" style={{ background: `#${o.k}` }} />
                            <span className="truncate">{typeof o.n === "string" ? o.n : o.n.en}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compact Main Title */}
      <h1
        className="mt-4 text-[clamp(1.5rem,4vw,2.5rem)] font-bold uppercase leading-[1.1] tracking-tight text-ivory"
        style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
      >
        {heading}
      </h1>

      {/* Results Counter */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-sand sm:text-sm">{list.length} {d.results}</p>
      </div>

      {/* Product Grid */}
      {list.length ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3">
            {list.slice(0, shown).map((p, i) => (
              <ProductCard key={p.slug} p={p} priority={i < 4} />
            ))}
          </div>
          {list.length > shown && (
            <div className="mt-10 text-center">
              <button onClick={() => setShown((n) => n + PAGE)} className="btn-glass min-h-[48px] rounded-none px-10 text-sm font-semibold">
                {d.showMore}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="surface mt-4 rounded-none border border-ivory/15 bg-coal/40 p-8 backdrop-blur-md">
          <p className="max-w-md text-sand">{items.length ? d.noResults : d.noProducts}</p>
          <WhatsAppButton message={generalMsg()} label={d.msgUs} className="mt-6" />
        </div>
      )}
    </section>
  );
}