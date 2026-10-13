"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { dict } from "@/lib/dict";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ d: propDict }: { d?: Record<string, string> }) {
  // Use passed prop if available, otherwise fall back directly to dict.en
  const d = propDict && Object.keys(propDict).length > 0 ? propDict : dict.en;

  // Direct WhatsApp URL to 8113010439
  const whatsappUrl = `https://wa.me/918113010439?text=${encodeURIComponent(
    "Hello! I am interested in your sofa collection and would like to make an inquiry."
  )}`;

  return (
    <section className="relative isolate flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden pb-10 pt-24 sm:pb-16 sm:pt-36">
      {/* Background Photography (Anchored Bottom-Right & Fills Viewport) */}
      <div className="absolute inset-0 -z-20 h-full w-full overflow-hidden" aria-hidden>
        {/* Mobile background image */}
        <Image
          src="/images/hero-bg-mobile.jpg"
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-bottom sm:hidden"
        />
        {/* Desktop background image anchored right-bottom */}
        <Image
          src="/images/hero-bg-desktop.png"
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          className="hidden object-cover object-right-bottom sm:block"
        />
        
        {/* Editorial Ink Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent sm:via-ink/70" />
      </div>

      {/* Subtle background glow */}
      <div
        className="sweep pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-none opacity-60 blur-3xl sm:h-[520px] sm:w-[820px]"
        style={{ background: "radial-gradient(closest-side, rgba(200,169,107,.28), transparent)" }}
      />

      {/* Inner Container: Matched to max-w-6xl px-5 sm:px-8 */}
      <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col justify-between px-5 sm:px-8">
        {/* Left-aligned header */}
        <div className="mb-8 max-w-none text-left sm:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            style={{
              WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 100%)",
            }}
            className="font-[family-name:var(--font-anton)] text-[clamp(2.6rem,9vw,3.4rem)] uppercase leading-[0.92] tracking-tight sm:text-[clamp(3.2rem,7vw,4.2rem)] sm:leading-[0.95] md:text-[clamp(3.8rem,6vw,5.8rem)] md:leading-[0.98]"
          >
            {/* XS Screens (< 640px): Exactly 8 lines */}
            <span className="block sm:hidden">
              <span className="block">SOFAS</span>
              <span className="block">MADE FOR</span>
              <span className="block">EVERYDAY</span>
              <span className="block">LIVING.</span>
              <span className="block">DELIVERED</span>
              <span className="block">ANYWHERE</span>
              <span className="block">ACROSS</span>
              <span className="block">KERALA</span>
            </span>

            {/* SM Screens (640px - 767px): Exactly 6 lines */}
            <span className="hidden sm:block md:hidden">
              <span className="block">SOFAS MADE FOR</span>
              <span className="block">EVERYDAY LIVING.</span>
              <span className="block">DELIVERED</span>
              <span className="block">ANYWHERE</span>
              <span className="block">ACROSS</span>
              <span className="block">KERALA</span>
            </span>

            {/* MD Screens and up (768px+): Exactly 5 lines */}
            <span className="hidden md:block">
              <span className="block">SOFAS MADE FOR</span>
              <span className="block">EVERYDAY LIVING</span>
              <span className="block">DELIVERED</span>
              <span className="block">ANYWHERE</span>
              <span className="block">ACROSS KERALA</span>
            </span>
          </motion.h1>
        </div>

        {/* Buttons aligned towards the bottom */}
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
              {/* Chunky Solid White "Explore" Button */}
              <Link
                href="/models"
                className="group relative flex min-h-[58px] items-center justify-center overflow-hidden rounded-none bg-ivory px-8 text-ink transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] active:scale-[0.98] sm:min-h-[72px] sm:px-12"
              >
                <span className="absolute inset-0 translate-y-full rounded-none bg-gradient-to-r from-gold via-ivory to-gold transition-transform duration-500 ease-out group-hover:translate-y-0" />
                
                <span className="font-[family-name:var(--font-anton)] relative z-10 text-xl uppercase tracking-wider transition-colors duration-300 group-hover:text-ink sm:text-3xl">
                  Explore
                </span>
              </Link>

              {/* Transparent "WhatsApp Us" Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[58px] items-center justify-center overflow-hidden rounded-none border border-ivory/25 bg-ivory/5 px-8 text-ivory backdrop-blur-md transition-all duration-500 ease-out hover:scale-[1.03] hover:border-ivory hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] active:scale-[0.98] sm:min-h-[72px] sm:px-12"
              >
                <span className="absolute inset-0 translate-y-full rounded-none bg-gradient-to-r from-ivory via-white to-ivory transition-transform duration-500 ease-out group-hover:translate-y-0" />
                
                <span className="font-[family-name:var(--font-anton)] relative z-10 text-xl uppercase tracking-wider transition-colors duration-300 group-hover:text-ink sm:text-3xl">
                  WhatsApp Us
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}