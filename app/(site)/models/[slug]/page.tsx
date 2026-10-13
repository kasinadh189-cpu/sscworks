import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { seatingTypes } from "@/lib/config";
import { dict } from "@/lib/dict";
import { getProducts } from "@/lib/products";
import { toCard } from "@/lib/search";
import ModelsExplorer from "@/components/ModelsExplorer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seating = seatingTypes.find((s) => s.slug === slug);
  if (!seating) return {};

  return {
    title: `${seating.en} Sofas & Seating`,
    alternates: { canonical: `/models/${slug}` },
  };
}

export default async function CategoryModelsPage({ params }: Props) {
  const { slug } = await params;
  const seating = seatingTypes.find((s) => s.slug === slug);
  if (!seating) notFound();

  const items = (await getProducts()).map(toCard);

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-5 pt-36 sm:px-8">
          <p className="animate-pulse text-xs font-semibold uppercase tracking-widest text-sand">
            Loading {seating.en}...
          </p>
        </div>
      }
    >
      <ModelsExplorer items={items} initialSeating={slug} />
    </Suspense>
  );
}