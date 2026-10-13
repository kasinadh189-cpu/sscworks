import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { lab, seatingTypes, site, styles, upholsteries } from "@/lib/config";
import { dict } from "@/lib/dict";
import { getProduct, getProducts } from "@/lib/products";
import { toCard } from "@/lib/search";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductCard from "@/components/ProductCard";
import SizeDiagram from "@/components/SizeDiagram";

type P = { params: Promise<{ slug: string }> };

const ratioOf = (url: string) => {
  const m = url.match(/-(\d+)x(\d+)\.[a-z]+/i);
  return m ? { w: +m[1], h: +m[2] } : { w: 4, h: 3 };
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};

  const name = typeof p.name === "string" ? p.name : p.name.en;
  const desc =
    (typeof p.description === "string" ? p.description : p.description?.en) ||
    (typeof p.tagline === "string" ? p.tagline : p.tagline?.en);

  return {
    title: name,
    description: desc,
    alternates: { canonical: `/product/${slug}` },
    openGraph: { title: name, description: desc, images: p.images[0] ? [p.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: P) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const d = dict.en;
  const name = typeof p.name === "string" ? p.name : p.name.en;
  const tagline = typeof p.tagline === "string" ? p.tagline : p.tagline.en;
  const description = typeof p.description === "string" ? p.description : p.description?.en;
  const frame = typeof p.frame === "string" ? p.frame : p.frame?.en;
  const foam = typeof p.foam === "string" ? p.foam : p.foam?.en;
  const base = typeof p.base === "string" ? p.base : p.base?.en;
  const leadTime = typeof p.leadTime === "string" ? p.leadTime : p.leadTime?.en;
  const warranty = typeof p.warranty === "string" ? p.warranty : p.warranty?.en;
  const care = typeof p.care === "string" ? p.care : p.care?.en;
  const sizeNote = typeof p.size.note === "string" ? p.size.note : p.size.note?.en;

  const url = `${site.url}/product/${slug}`;
  const all = await getProducts();
  const picked = p.related.map((s) => all.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => !!x);
  const related = (picked.length ? picked : all.filter((x) => x.seating === p.seating && x.slug !== slug)).slice(0, 4);

  const meta = [lab(seatingTypes, p.seating, "en"), lab(styles, p.style, "en"), p.code].filter(Boolean);

  const sizeRows: [string, number | undefined][] = [
    [d.length, p.size.length],
    [d.depth, p.size.depth],
    [d.height, p.size.height],
    [d.seatHeight, p.size.seatHeight],
  ];

  const buildRows: [string, string][] = [
    [d.frame, frame || ""],
    [d.foam, foam || ""],
    [d.upholstery, p.upholstery.map((u) => lab(upholsteries, u, "en")).join(", ")],
    [d.base, base || ""],
  ];

  const deliveryRows: [string, string][] = [
    [d.leadTime, leadTime || ""],
    [d.assembly, p.assembly ? d.yes : ""],
    [d.warranty, warranty || ""],
    [d.customise, [p.customSize ? d.canSize : d.fixed, p.customFabric ? d.canFabric : ""].filter(Boolean).join(". ")],
  ];

  const rows = (r: [string, string | number | undefined][]) => r.filter(([, v]) => v !== undefined && v !== "");
  const card = "surface rounded-[24px] p-6 sm:rounded-[28px]";

  const Table = ({ title, data }: { title: string; data: [string, string | number | undefined][] }) =>
    rows(data).length ? (
      <div className={card}>
        <h3 className="font-display text-2xl">{title}</h3>
        <dl className="mt-4 divide-y divide-ivory/10">
          {rows(data).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 py-3 text-[15px]">
              <dt className="text-sand">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    ) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: p.code || undefined,
    description,
    category: "Sofa",
    image: p.images.length ? p.images : undefined,
    brand: { "@type": "Brand", name: site.name },
    url,
  };

  return (
    <article className="mx-auto max-w-6xl px-4 pb-28 pt-24 sm:px-8 sm:pt-40 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/models" className="inline-flex min-h-[44px] items-center text-sm text-sand transition-colors hover:text-gold-soft">
        {d.backToModels}
      </Link>

      {/* Dominant Preview Grid Layout: 8 cols for gallery, 4 cols for info */}
      <div className="mt-2 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="lg:col-span-8">
          <ProductGallery images={p.images} name={name} slug={slug} />
        </div>
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <ProductInfo
            d={d}
            name={name}
            nameEn={p.name.en}
            code={p.code}
            url={url}
            tagline={tagline || ""}
            features={p.features.map((f) => (typeof f === "string" ? f : f.en))}
            meta={meta}
            swatches={p.swatches.map((s) => {
              const swatchName = typeof s.name === "string" ? s.name : s.name.en;
              return { label: swatchName, en: s.name.en, hex: s.hex, image: s.image };
            })}
            customSize={p.customSize}
          />
        </div>
      </div>

      {description && (
        <section className="mt-16 max-w-2xl">
          <h2 className="font-heavy text-4xl sm:text-5xl">{d.description}</h2>
          <p className="mt-5 whitespace-pre-line text-lg leading-8 text-sand">{description}</p>
        </section>
      )}

      <section className="mt-14 grid gap-4 md:grid-cols-2">
        {p.size.length && p.size.height ? (
          <div className={card}>
            <h3 className="font-display text-2xl">{d.size}</h3>
            <p className="mt-1 text-sm text-sand">{d.sizeNote}</p>
            <div className="mt-4">
              <SizeDiagram length={p.size.length} depth={p.size.depth} height={p.size.height} />
            </div>
            <dl className="mt-4 divide-y divide-ivory/10">
              {rows(sizeRows).map(([k, v]) => (
                <div key={k} className="flex justify-between py-3 text-[15px]">
                  <dt className="text-sand">{k}</dt>
                  <dd>{v}&quot;</dd>
                </div>
              ))}
            </dl>
            {sizeNote && <p className="mt-3 text-sm text-sand">{sizeNote}</p>}
          </div>
        ) : null}
        <div className="grid content-start gap-4">
          <Table title={d.build} data={buildRows} />
          <Table title={d.deliveryInfo} data={deliveryRows} />
        </div>
      </section>

      {care && (
        <section className={`${card} mt-4`}>
          <h3 className="font-display text-2xl">{d.care}</h3>
          <p className="mt-3 max-w-2xl text-sand">{care}</p>
        </section>
      )}

      {p.roomImages.length > 0 && (
        <section className="mt-14 grid gap-2 sm:gap-3">
          {Array.from({ length: Math.ceil(p.roomImages.length / 2) }, (_, r) => p.roomImages.slice(r * 2, r * 2 + 2)).map((row, r) => {
            const dims = row.map(ratioOf);
            const sum = dims.reduce((a, dm) => a + dm.w / dm.h, 0);
            const lone = row.length === 1;
            return (
              <div
                key={r}
                className="flex gap-2 sm:gap-3"
                style={lone ? { width: "100%", maxWidth: `calc(85vh * ${dims[0].w / dims[0].h})`, marginInline: "auto" } : undefined}
              >
                {row.map((src, i) => {
                  const ar = dims[i].w / dims[i].h;
                  const pct = Math.round((ar / sum) * 100);
                  return (
                    <div key={src} className="min-w-0" style={{ flex: `${ar} 1 0%` }}>
                      <Image
                        src={src}
                        alt={`${name} ${r * 2 + i + 1}`}
                        width={dims[i].w}
                        height={dims[i].h}
                        sizes={`(max-width: 1152px) ${pct}vw, ${Math.round((1100 * pct) / 100)}px`}
                        className="block h-auto w-full"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heavy text-4xl sm:text-5xl">{d.related}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.slug} p={toCard(r)} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}