"use client";
import { usePathname } from "next/navigation";
import WhatsAppIcon from "./WhatsAppIcon";
import { waLink, generalMsg } from "@/lib/whatsapp";

export default function FloatingWhatsApp({ label }: { label: string }) {
  const path = usePathname();
  // Product pages have their own bottom bar on phones.
  if (path.includes("/product/")) return null;
  return (
    <a
      href={waLink(generalMsg())} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="btn-gold fixed bottom-5 right-4 z-40 grid h-14 w-14 place-items-center rounded-none sm:bottom-7 sm:right-7"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
