// ─── EDIT THIS FILE when you have your shop details ───────────────
export const site = {
  name: "Atelier Noir", // TODO: your shop name
  wordmark: "SSCworks", // giant text at the bottom of the footer
  phone: "918113010439", // WhatsApp number, digits only
  phoneDisplay: "+91 81130 10439",
  city: "Kozhikode", // TODO: your shop's city
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  address: "", // TODO: street address (improves local SEO)
  instagram: "https://www.instagram.com/", // TODO: your Instagram link (leave "" to hide the button)
  facebook: "https://www.facebook.com/", // TODO: your Facebook page link (leave "" to hide the button)
};

export const locales = ["en", "ml"] as const;
export type Locale = (typeof locales)[number];
export type L = { en: string; ml: string };

export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

type Opt = { slug: string; en: string; ml: string };

export const seatingTypes: Opt[] = [
  { slug: "2-seater", en: "2-Seater", ml: "2 സീറ്റർ" },
  { slug: "3-seater", en: "3-Seater", ml: "3 സീറ്റർ" },
  { slug: "l-shape", en: "L-Shape", ml: "എൽ-ഷേപ്പ്" },
  { slug: "corner", en: "Corner", ml: "കോർണർ" },
  { slug: "recliner", en: "Recliner", ml: "റിക്ലൈനർ" },
  { slug: "sofa-cum-bed", en: "Sofa-cum-bed", ml: "സോഫ-കം-ബെഡ്" },
];

export const styles: Opt[] = [
  { slug: "modern", en: "Modern", ml: "മോഡേൺ" },
  { slug: "classic", en: "Classic", ml: "ക്ലാസിക്" },
  { slug: "contemporary", en: "Contemporary", ml: "കണ്ടംപററി" },
];

export const upholsteries: Opt[] = [
  { slug: "velvet", en: "Velvet", ml: "വെൽവെറ്റ്" },
  { slug: "linen", en: "Linen", ml: "ലിനൻ" },
  { slug: "fabric", en: "Fabric", ml: "ഫാബ്രിക്" },
  { slug: "leatherette", en: "Leatherette", ml: "ലെതറെറ്റ്" },
  { slug: "leather", en: "Leather", ml: "ലെതർ" },
];

export const lab = (list: Opt[], slug: string, locale: Locale) =>
  list.find((o) => o.slug === slug)?.[locale] ?? slug;

export const districts: { slug: string; en: string; ml: string }[] = [
  { slug: "thiruvananthapuram", en: "Thiruvananthapuram", ml: "തിരുവനന്തപുരം" },
  { slug: "kollam", en: "Kollam", ml: "കൊല്ലം" },
  { slug: "pathanamthitta", en: "Pathanamthitta", ml: "പത്തനംതിട്ട" },
  { slug: "alappuzha", en: "Alappuzha", ml: "ആലപ്പുഴ" },
  { slug: "kottayam", en: "Kottayam", ml: "കോട്ടയം" },
  { slug: "idukki", en: "Idukki", ml: "ഇടുക്കി" },
  { slug: "ernakulam", en: "Ernakulam", ml: "എറണാകുളം" },
  { slug: "thrissur", en: "Thrissur", ml: "തൃശ്ശൂർ" },
  { slug: "palakkad", en: "Palakkad", ml: "പാലക്കാട്" },
  { slug: "malappuram", en: "Malappuram", ml: "മലപ്പുറം" },
  { slug: "kozhikode", en: "Kozhikode", ml: "കോഴിക്കോട്" },
  { slug: "wayanad", en: "Wayanad", ml: "വയനാട്" },
  { slug: "kannur", en: "Kannur", ml: "കണ്ണൂർ" },
  { slug: "kasaragod", en: "Kasaragod", ml: "കാസർഗോഡ്" },
];

export const tr = (v: L, locale: Locale) => v[locale] || v.en;