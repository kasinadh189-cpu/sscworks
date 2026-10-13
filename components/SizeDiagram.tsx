export default function SizeDiagram({ length, depth, height }: { length?: number; depth?: number; height?: number }) {
  if (!length || !height) return null;
  const s = 190 / length;
  const fh = Math.min(height * s, 110);
  const sd = Math.min((depth ?? 0) * s, 110);
  const stroke = { stroke: "var(--color-gold)", fill: "rgba(200,169,107,.08)", strokeWidth: 1.5 } as const;
  return (
    <svg viewBox="0 0 380 170" className="w-full max-w-md text-sand" role="img" aria-label={`${length} x ${depth ?? "-"} x ${height} inches`}>
      <rect x="20" y="16" width="190" height={fh} rx="14" {...stroke} />
      <text x="115" y={16 + fh + 22} textAnchor="middle" fontSize="13" fill="currentColor">{length}&quot;</text>
      <text x="218" y={16 + fh / 2 + 4} fontSize="13" fill="currentColor">{height}&quot;</text>
      {depth ? (
        <>
          <rect x="270" y="16" width={sd} height={fh} rx="12" {...stroke} />
          <text x={270 + sd / 2} y={16 + fh + 22} textAnchor="middle" fontSize="13" fill="currentColor">{depth}&quot;</text>
        </>
      ) : null}
    </svg>
  );
}
