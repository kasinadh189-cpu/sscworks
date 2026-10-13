"use client";

import { useEffect, useRef } from "react";

export default function Wordmark({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastWidth = 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const fit = () => {
      const w = wrap.current;
      const s = span.current;
      if (!w || !s || !ctx) return;
      
      lastWidth = w.clientWidth;
      if (!lastWidth) return;

      // 1. Size the text so it spans the width exactly
      s.style.fontSize = "100px";
      const natural = s.getBoundingClientRect().width;
      if (!natural) return;
      
      const size = (lastWidth / natural) * 100;
      s.style.fontSize = `${size}px`;

      // 2. Measure the real ink
      ctx.font = `${size}px ${getComputedStyle(s).fontFamily || "var(--font-anton), sans-serif"}`;
      const m = ctx.measureText(text);
      
      const fa = m.fontBoundingBoxAscent ?? size * 1.17;
      const fd = m.fontBoundingBoxDescent ?? size * 0.33;
      const inkAsc = m.actualBoundingBoxAscent ?? size * 0.8;
      const inkDesc = Math.max(m.actualBoundingBoxDescent ?? 0, 0);

      // Baseline positioning inside line box
      const baseline = (size - (fa + fd)) / 2 + fa;
      const top = baseline - inkAsc;
      const bottom = baseline + inkDesc;
      const padTop = size * 0.06;

      s.style.lineHeight = `${size}px`;
      s.style.marginTop = `${-top + padTop}px`;
      w.style.height = `${padTop + inkAsc + inkDesc + 1}px`;

      s.style.backgroundImage = `linear-gradient(180deg, rgba(255,255,255,.96) ${top}px, rgba(255,255,255,.03) ${bottom}px)`;
    };

    fit();
    
    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    const ro = new ResizeObserver(() => {
      if (wrap.current && wrap.current.clientWidth !== lastWidth) fit();
    });

    if (wrap.current) ro.observe(wrap.current);

    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={wrap} className="w-full select-none overflow-hidden" aria-hidden>
      <span
        ref={span}
        className="block whitespace-nowrap"
        style={{
          fontFamily: "var(--font-anton), Impact, sans-serif",
          fontWeight: 400,
          fontSize: "20vw",
          lineHeight: 1,
          letterSpacing: 0,
          width: "max-content",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {text}
      </span>
    </div>
  );
}