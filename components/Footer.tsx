"use client";

import type { Dict } from "@/lib/dict";
import { site } from "@/lib/config";
import { generalMsg, waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";
import Wordmark from "./Wordmark";

type Props = {
  d?: Partial<Dict> | Record<string, string>;
};

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 shrink-0" aria-hidden>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 shrink-0" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

function SocialButton({ href, label, sub, icon }: { href: string; label: string; sub: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex min-h-[64px] w-full items-center overflow-hidden rounded-none border border-ivory/25 bg-ivory/5 px-5 text-ivory backdrop-blur-md transition-all duration-500 ease-out hover:border-ivory hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] sm:hover:scale-[1.02]"
    >
      <span className="absolute inset-0 translate-y-full rounded-none bg-gradient-to-r from-ivory via-white to-ivory transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <span className="relative z-10 flex items-center gap-4 transition-colors duration-300 group-hover:text-ink">
        {icon}
        <span className="text-left leading-tight">
          <span className="block font-sans text-base font-semibold">{label}</span>
          <span className="block font-sans text-xs font-medium opacity-70">{sub}</span>
        </span>
      </span>
    </a>
  );
}

export default function Footer({ d }: Props) {
  const t = { chat: "Chat with us", follow: "Follow us", like: "Like our page" };

  return (
    <footer className="mt-24 overflow-x-clip border-t border-ivory/10 sm:mt-32">
      <div className="mx-auto grid max-w-6xl gap-2.5 px-4 pt-10 sm:grid-cols-3 sm:gap-3 sm:px-8 sm:pt-14">
        <SocialButton href={waLink(generalMsg())} label="WhatsApp" sub={t.chat} icon={<WhatsAppIcon className="h-6 w-6 shrink-0" />} />
        {site.instagram && <SocialButton href={site.instagram} label="Instagram" sub={t.follow} icon={<InstagramIcon />} />}
        {site.facebook && <SocialButton href={site.facebook} label="Facebook" sub={t.like} icon={<FacebookIcon />} />}
      </div>

      <div className="px-4 pb-0 pt-8 sm:px-8 sm:pt-12">
        <Wordmark text={site.wordmark} />
      </div>
    </footer>
  );
}