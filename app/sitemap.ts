import type { MetadataRoute } from "next";
import { districts, locales, seatingTypes, site } from "@/lib/config";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const paths = [
    "", "/models", "/custom",
    ...seatingTypes.map((c) => `/models/${c.slug}`),
    ...districts.map((d) => `/delivery/${d.slug}`),
    ...products.map((p) => `/product/${p.slug}`),
  ];
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: `${site.url}/${l}${p}`,
      changeFrequency: "weekly" as const,
      alternates: { languages: { en: `${site.url}/en${p}`, ml: `${site.url}/ml${p}` } },
    })),
  );
}
