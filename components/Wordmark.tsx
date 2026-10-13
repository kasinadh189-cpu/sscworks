"use client";

import { useEffect, useRef } from "react";

// Spans the full width exactly, and trims the box to the painted letters so there is no empty space below them.
export default function Wordmark({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastWidth = 0;
    const ctx = document.createElement("canvas").getContext("2d");

    const fit = () => {
      const w = wrap.current,
        s = span.current;
      if (!w || !s || !ctx) return;
      lastWidth = w.clientWidth;

      // 1. Size the text so it spans the width exactly
      s.style.fontSize = "100px";
      const natural = s.getBoundingClientRect().width;
      if (!natural) return;
      const size = (lastWidth / natural) * 100;
      s.style.fontSize = `${size}px`;

      // 2. Measure the real ink (the painted letters)
      ctx.font = `${size}px ${getComputedStyle(s).fontFamily}`;
      const m = ctx.measureText(text);
      const fa = m.fontBoundingBoxAscent ?? size * 1.17;
      const fd = m.fontBoundingBoxDescent ?? size * 0.33;
      const inkAsc = m.actualBoundingBoxAscent;
      const inkDesc = Math.max(m.actualBoundingBoxDescent, 0);

      // Where the letters sit inside a line box of height `size`
      const baseline = (size - (fa + fd)) / 2 + fa;
      const top = baseline - inkAsc;
      const bottom = baseline + inkDesc;
      const padTop = size * 0.06; // breathing room above only

      s.style.lineHeight = `${size}px`;
      s.style.marginTop = `${-top + padTop}px`;
      w.style.height = `${padTop + inkAsc + inkDesc + 1}px`;

      // White at the top of the letters, fading to almost nothing at the bottom edge
      s.style.backgroundImage = `linear-gradient(180deg, rgba(255,255,255,.96) ${top}px, rgba(255,255,255,.03) ${bottom}px)`;
    };

    fit();
    document.fonts?.ready.then(fit);
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