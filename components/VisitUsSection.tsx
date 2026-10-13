"use client";

import Link from "next/link";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Google Maps Embed & Pin Links
const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.42398284534!2d75.73373756857147!3d11.258753112261622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65938563d4747%3A0x32150641ca32ecab!2sKozhikode%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

const DIRECT_MAPS_URL = "https://maps.google.com/?q=Kozhikode,+Kerala";

export default function VisitUsSection() {
  return (
    <section className="relative isolate mb-0 w-full border-t border-ivory/10 bg-ink pt-16 pb-0 sm:pt-24 sm:pb-0">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(200,169,107,0.25), transparent)",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-5 pb-0 sm:px-8">
        <div className="grid gap-8 pb-0 lg:grid-cols-12 lg:items-stretch">
          {/* Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-col justify-between border border-ivory/15 bg-ivory/5 p-8 backdrop-blur-md lg:col-span-5 sm:p-10"
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-[family-name:var(--font-anton)] text-[clamp(2.2rem,5vw,3.6rem)] uppercase leading-[0.95] tracking-tight text-ivory">
                  VISIT OUR FACTORY
                </h2>
                <p className="mt-2 text-base font-light text-ivory/70 sm:text-lg">
                  See how our sofas are built and feel the quality in person.
                </p>
              </div>

              <div className="h-px w-full bg-ivory/10" />

              <div className="space-y-2">
                <h3 className="font-[family-name:var(--font-anton)] text-xl uppercase tracking-wider text-gold sm:text-2xl">
                  LOCATION
                </h3>
                <p className="text-lg font-light leading-relaxed text-ivory/90 sm:text-xl">
                  Kerala, Kozhikode, Vadakara, Iringal PO
                  <br />
                  Kottakkal, Choolaparambath 673521
                </p>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href={DIRECT_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[58px] w-full items-center justify-center overflow-hidden border border-ivory/25 bg-ivory/10 px-8 text-ivory transition-all duration-500 ease-out hover:scale-[1.02] hover:border-ivory hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98]"
              >
                {/* Offset to 102% prevents sub-pixel white bleed before hover */}
                <span className="absolute inset-0 translate-y-[102%] bg-ivory transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="font-[family-name:var(--font-anton)] relative z-10 text-xl uppercase tracking-wider transition-colors duration-300 group-hover:text-ink sm:text-2xl">
                  OPEN IN GOOGLE MAPS →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Right Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="relative aspect-square w-full border border-ivory/15 bg-black/40 lg:col-span-7 lg:min-h-[500px]"
          >
            <iframe
              title="Factory Location Map"
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "grayscale(1) contrast(1.1) brightness(0.9)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}