// Luxury gradient stand-in until real product photos are uploaded.
const tones = [
  ["#1c2b52", "#0a1224"], ["#18284a", "#09111f"], ["#203462", "#0c1529"],
  ["#16233f", "#080f1d"], ["#1d2d55", "#0b1426"],
];
export default function Placeholder({ seed, label }: { seed: string; label: string }) {
  const i = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % tones.length;
  const [a, b] = tones[i];
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center"
      style={{ background: `radial-gradient(120% 90% at 30% 10%, ${a}, ${b})` }}
    >
      <div className="h-[58%] w-[46%] rounded-t-full border border-gold/25"
        style={{ background: "linear-gradient(180deg, rgba(200,169,107,.14), rgba(200,169,107,0))" }} />
      <span className="font-display absolute bottom-5 left-6 text-5xl text-gold/30">{label.slice(0, 1)}</span>
    </div>
  );
}
