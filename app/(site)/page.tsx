import Link from "next/link";
import Image from "next/image";
import { dict } from "@/lib/dict";
import { getProducts } from "@/lib/products";
import { toCard } from "@/lib/search";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import VisitUsSection from "@/components/VisitUsSection";

export default async function Home() {
  const d = dict.en;
  const all = (await getProducts()).map(toCard);
  const best = all.filter((p) => p.badge === "bestseller");
  const picks = (best.length ? best : all).slice(0, 6);

  // Direct WhatsApp link pointing to 8113010439
  const whatsappUrl = `https://wa.me/918113010439?text=${encodeURIComponent(
    "Hello! I am interested in ordering a custom sofa and would like to get in touch."
  )}`;

  // Standardized Anton typography class for section headers
  const h2 = "font-[family-name:var(--font-anton)] text-[clamp(2.4rem,8vw,4.5rem)] uppercase leading-[0.95] tracking-tight";

  return (
    <>
      <Hero />

      {/* Bestsellers Section */}
      <section id="bestsellers" className="mx-auto mt-20 max-w-6xl scroll-mt-28 px-4 sm:mt-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className={h2}>{d.bestsellersTitle}</h2>
            <p className="mt-3 max-w-md text-sand">{d.bestsellersSub}</p>
          </div>
          <Link href="/models" className="btn-glass flex min-h-[48px] items-center rounded-none px-6 text-sm font-medium">
            {d.viewAll}
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
          {picks.map((p, i) => (
            <ProductCard key={p.slug} p={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* Full-Screen Custom Section with WhatsApp CTA */}
      <section className="relative isolate mt-24 sm:mt-32 flex min-h-[100dvh] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex-col justify-center overflow-hidden border-y border-gold/20 py-16 sm:py-24">
        {/* Mobile Background Image (PNG) */}
        <Image
          src="/images/custom-bg-mobile.png"
          alt="Custom sofa crafting"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center -z-20 sm:hidden"
        />

        {/* Desktop Background Image (PNG) */}
        <Image
          src="/images/custom-bg-desktop.png"
          alt="Custom sofa crafting"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="hidden object-cover object-left -z-20 sm:block"
        />

        {/* Ink Theme Gradient Background Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink via-ink/80 to-transparent" />

        {/* Inner Content Container */}
        <div className="mx-auto flex w-full max-w-6xl items-center px-5 sm:px-8">
          {/* Right-Aligned Stack with Soft Left-to-Right Fade */}
          <div className="flex flex-col items-end text-right ml-auto w-full max-w-2xl">
            <h2
              style={{
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%)",
              }}
              className="font-[family-name:var(--font-anton)] text-[clamp(3.8rem,14vw,8rem)] uppercase leading-[0.92] tracking-tight text-ivory flex flex-col items-end"
            >
              <span className="block">HAVE A</span>
              <span className="block">CUSTOM</span>
              <span className="block">SOFA</span>
              <span className="block">IN MIND?</span>
            </h2>

            {/* Direct WhatsApp Action Button targeting 8113010439 */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-10 flex min-h-[58px] items-center justify-center overflow-hidden rounded-none bg-ivory px-8 text-ink transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] active:scale-[0.98] sm:min-h-[72px] sm:px-12"
            >
              {/* Gold sliding hover fill */}
              <span className="absolute inset-0 translate-y-full rounded-none bg-gradient-to-r from-gold via-ivory to-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
              
              {/* Button text with Anton typography */}
              <span className="font-[family-name:var(--font-anton)] relative z-10 text-xl uppercase tracking-wider transition-colors duration-300 group-hover:text-ink sm:text-3xl">
                WHATSAPP US
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Visit Factory Section (Final section on Home) */}
      <div className="pb-0 mb-0">
        <VisitUsSection />
      </div>
    </>
  );
}