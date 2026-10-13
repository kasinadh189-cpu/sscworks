import type { Metadata, Viewport } from "next";
import { Anton, Cormorant_Garamond, Inter_Tight, Manrope } from "next/font/google";
import "@/app/globals.css"; // Fixed path alias
import { seatingTypes, site } from "@/lib/config";
import { dict } from "@/lib/dict";
import { getProducts } from "@/lib/products";
import { toCard } from "@/lib/search";
import { buildColours } from "@/lib/colours";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const viewport: Viewport = { themeColor: "#060b16", width: "device-width", initialScale: 1 };

export async function generateMetadata(): Promise<Metadata> {
  const title = `${site.name} | Premium sofas in ${site.city}, delivered across Kerala`;
  const description = dict.en.heroSub;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s | ${site.name}` },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, siteName: site.name, type: "website", locale: "en_IN" },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const d = dict.en;
  const products = await getProducts();
  const colours = buildColours(products);
  const best = products.filter((p) => p.badge === "bestseller");

  // Bestsellers as full card data so ProductCard renders its hover states and badges
  const featured = (best.length ? best : products).slice(0, 3).map(toCard);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: site.name,
    url: site.url,
    telephone: `+${site.phone}`,
    areaServed: { "@type": "State", name: "Kerala" },
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: "Kerala", addressCountry: "IN", streetAddress: site.address || undefined },
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${anton.variable} ${interTight.variable} ${manrope.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header d={d} seating={seatingTypes.map((c) => ({ slug: c.slug, label: c.en }))} featured={featured} colours={colours} />
        <main>{children}</main>
        <Footer d={d} />
        <FloatingWhatsApp label={d.whatsappUs} />
      </body>
    </html>
  );
}