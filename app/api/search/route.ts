import { getProducts } from "@/lib/products";
import { toCard } from "@/lib/search";

export const revalidate = 60;

export async function GET() {
  const items = (await getProducts()).map(toCard);
  return Response.json(items, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
