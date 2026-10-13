import { Suspense } from "react";
import type { Metadata } from "next";
import { dict } from "@/lib/dict";
import { getProducts } from "@/lib/products";
import { toCard } from "@/lib/search";
import ModelsExplorer from "@/components/ModelsExplorer";

export const metadata: Metadata = {
  title: "All Furniture Models & Sofas",
  alternates: { canonical: "/models" },
};

export default async function ModelsPage() {
  const items = (await getProducts()).map(toCard);
  const d = dict.en;

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-5 pt-36 sm:px-8">
          <p className="animate-pulse text-xs font-semibold uppercase tracking-widest text-sand">
            Loading Collection...
          </p>
        </div>
      }
    >
      <ModelsExplorer items={items} title={d.allModels} />
    </Suspense>
  );
}