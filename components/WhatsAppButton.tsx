import WhatsAppIcon from "./WhatsAppIcon";
import { waLink } from "@/lib/whatsapp";

export default function WhatsAppButton({
  message, label, variant = "gold", className = "",
}: { message: string; label: string; variant?: "gold" | "glass"; className?: string }) {
  return (
    <a
      href={waLink(message)} target="_blank" rel="noopener noreferrer"
      className={`${variant === "gold" ? "btn-gold" : "btn-glass"} inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-none px-7 text-[15px] font-semibold ${className}`}
    >
      <WhatsAppIcon /> {label}
    </a>
  );
}
