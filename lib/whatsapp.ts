import { site } from "./config";

export const waLink = (message: string) =>
  `https://wa.me/${site.phone}?text=${encodeURIComponent(message)}`;

export const generalMsg = () =>
  `Hi ${site.name}, I'd like to know more about your sofas.`;

export const productMsg = (o: {
  name: string;
  code?: string;
  url: string;
  colour?: string;
  imageUrl?: string;
  extra?: string;
}) =>
  [
    `Hi ${site.name}, I'm interested in this sofa: ${o.name}${o.code ? ` (\${o.code})` : ""}.`,
    o.colour ? `Colour I like: ${o.colour}` : "",
    o.imageUrl ? `Photo: ${o.imageUrl}` : "",
    o.extra ?? "",
    o.url,
    "Could you share more details?",
  ]
    .filter(Boolean)
    .join("\n");

export const customMsg = (f: {
  type: string;
  size: string;
  material: string;
  notes: string;
}) =>
  [
    `Hi ${site.name}, I'd like a custom sofa made.`,
    `Type: ${f.type || "-"}`,
    `Size / space: ${f.size || "-"}`,
    `Fabric / finish: ${f.material || "-"}`,
    f.notes ? `Notes: ${f.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

export const districtMsg = (district: string) =>
  `Hi ${site.name}, I'm in ${district}. Do you deliver here? I'd like to see your sofas.`;