"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { seatingTypes, styles, upholsteries, type L } from "@/lib/config";
import { matchesQuery, type CardData } from "@/lib/search";
import ProductCard from "./ProductCard";

type Item = { label: string; kind: string; href: string };

let cache: CardData[] | null = null;

export default function SearchOverlay({ d }: { d: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [seating, setSeating] = useState("");
  const [style, setStyle] = useState("");
  const [fabric, setFabric] = useState("");
  const [colour, setColour] = useState("");
  
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [items, setItems] = useState<CardData[]>(cache ?? []);
  const ref = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    if (cache) return;
    fetch("/api/search")
      .then((r) => r.json())
      .then((j: CardData[]) => {
        cache = j;
        setItems(j);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
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
    items.forEach((c) => c.colours?.forEach((x) => { if (!m.has(x.k)) m.set(x.k, x.n); }));
    return [...m.entries()].map(([k, n]) => ({ k, n }));
  }, [items]);

  const term = q.trim().toLowerCase();

  const options = useMemo<Item[]>(() => {
    const pick = (list: typeof seatingTypes, kind: string, href: (s: string) => string): Item[] =>
      list
        .filter((o) => !term || o.en.toLowerCase().includes(term))
        .map((o) => ({ label: o.en, kind, href: href(o.slug) }));
    const filters = [
      ...pick(seatingTypes, d.fSeating, (s) => `/models/${s}`),
      ...pick(styles, d.fStyle, (s) => `/models?style=${s}`),
      ...pick(upholsteries, d.fFabric, (s) => `/models?fabric=${s}`),
    ];
    const names: Item[] = term
      ? items
          .filter((c) => c.name.en.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
          .slice(0, 4)
          .map((c) => ({ label: c.name.en, kind: d.searchSofas, href: `/product/${c.slug}` }))
      : [];
    return [...names, ...(term ? filters : filters.slice(0, 6))].slice(0, 10);
  }, [term, items, d]);

  const found = useMemo(() => {
    return items.filter((c) => {
      const matchSeating = !seating || c.seating === seating;
      const matchStyle = !style || c.style === style;
      const matchFabric = !fabric || c.upholstery.includes(fabric);
      const matchColour = !colour || c.colours?.some((x) => x.k === colour);
      const matchQ = matchesQuery(c, q);
      return matchSeating && matchStyle && matchFabric && matchColour && matchQ;
    });
  }, [items, seating, style, fabric, colour, q]);

  const activeCount = [seating, style, fabric, colour].filter(Boolean).length;
  const active = !!q || activeCount > 0;
  const clearFilters = () => {
    setSeating("");
    setStyle("");
    setFabric("");
    setColour("");
    setQ("");
    setOpenDropdown(null);
  };

  const shown = (
    term || activeCount > 0
      ? found
      : found.filter((c) => c.badge === "bestseller").length
      ? found.filter((c) => c.badge === "bestseller")
      : items
  ).slice(0, 8);

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
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-8 sm:pt-16">
      <div
        ref={boxRef}
        className="sticky top-[56px] z-30 rounded-none border border-ivory/10 bg-ink/90 p-2.5 backdrop-blur-xl sm:top-[72px] sm:p-3"
      >
        <div className="flex flex-col gap-2.5">
          {/* Top Row: Search Input + Filter Drawer Toggle */}
          <div className="flex items-center gap-2">
            <div className="surface search-box flex flex-1 min-h-[38px] sm:min-h-[42px] items-center gap-2 rounded-none border border-ivory/20 bg-coal/40 px-3 py-1">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>

              <input
                ref={ref}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={d.searchPlaceholder}
                aria-label={d.search}
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                className="w-full bg-transparent text-sm text-ivory placeholder:text-sand/60 focus:outline-none focus:ring-0 sm:text-base"
              />

              {active && (
                <button
                  onClick={clearFilters}
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

          {/* Collapsible Dropdown Filter Buttons */}
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

      {options.length > 0 && !term && activeCount === 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-sand/80">{d.popular}</p>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap">
            {options.map((o) => (
              <Link
                key={o.href + o.label}
                href={o.href}
                className="group relative flex min-h-[44px] shrink-0 items-center justify-center overflow-hidden rounded-none border border-ivory/20 bg-ivory/5 px-6 text-xs font-semibold text-ivory backdrop-blur-md transition-all duration-500 ease-out hover:scale-[1.03] hover:border-ivory hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-95"
              >
                <span className="absolute inset-0 translate-y-[102%] rounded-none bg-gradient-to-r from-ivory via-white to-ivory transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                  {o.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-sand">
          {d.searchSofas} ({found.length})
        </p>
        {shown.length ? (
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {shown.map((c) => (
              <ProductCard key={c.slug} p={c} />
            ))}
          </div>
        ) : (
          <p className="mt-4 max-w-md text-sand">{d.searchNone}</p>
        )}

        {term && found.length > shown.length && (
          <div className="mt-10 text-center">
            <Link
              href={`/models?q=${encodeURIComponent(q.trim())}`}
              className="group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-none bg-ivory px-8 text-xs font-bold uppercase tracking-wider text-ink transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] active:scale-95"
            >
              <span className="absolute inset-0 translate-y-[102%] rounded-none bg-gradient-to-r from-gold via-ivory to-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                {d.seeAll} ({found.length})
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}