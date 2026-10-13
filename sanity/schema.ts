import { defineArrayMember, defineField, defineType } from "sanity";

const localeString = defineType({
  name: "localeString", title: "Text", type: "object", options: { columns: 2 },
  fields: [defineField({ name: "en", title: "English", type: "string" }), defineField({ name: "ml", title: "Malayalam", type: "string" })],
});

const localeText = defineType({
  name: "localeText", title: "Long text", type: "object",
  fields: [defineField({ name: "en", title: "English", type: "text", rows: 5 }), defineField({ name: "ml", title: "Malayalam", type: "text", rows: 5 })],
});

const swatch = defineType({
  name: "swatch", title: "Colour", type: "object",
  fields: [
    defineField({ name: "name", title: "Colour name", type: "localeString" }),
    defineField({ name: "hex", title: "Colour code (like #1c2b52)", type: "string", description: "Use this OR a photo of the fabric." }),
    defineField({ name: "image", title: "Fabric photo", type: "image" }),
  ],
  preview: { select: { title: "name.en", media: "image" } },
});

const product = defineType({
  name: "product", title: "Sofa model", type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true }, { name: "photos", title: "Photos" },
    { name: "specs", title: "Size and build" }, { name: "options", title: "Colours and custom" },
    { name: "delivery", title: "Delivery and care" }, { name: "control", title: "Show / hide" },
  ],
  fields: [
    defineField({ name: "name", title: "Model name", type: "localeString", group: "basics" }),
    defineField({ name: "code", title: "Model code", type: "string", group: "basics", description: "For example SF-101" }),
    defineField({ name: "slug", title: "Page address", type: "slug", group: "basics", options: { source: "name.en", maxLength: 80 }, validation: (r) => r.required(), description: "Click Generate." }),
    defineField({ name: "tagline", title: "One-line tagline", type: "localeString", group: "basics" }),
    defineField({ name: "description", title: "Description", type: "localeText", group: "basics" }),
    defineField({ name: "features", title: "Key features (short points)", type: "array", group: "basics", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "seating", title: "Seating type", type: "string", group: "basics", validation: (r) => r.required(),
      options: { list: [
        { title: "2-Seater", value: "2-seater" }, { title: "3-Seater", value: "3-seater" }, { title: "L-Shape", value: "l-shape" },
        { title: "Corner", value: "corner" }, { title: "Recliner", value: "recliner" }, { title: "Sofa-cum-bed", value: "sofa-cum-bed" },
      ] } }),
    defineField({ name: "style", title: "Style", type: "string", group: "basics",
      options: { list: [{ title: "Modern", value: "modern" }, { title: "Classic", value: "classic" }, { title: "Contemporary", value: "contemporary" }] } }),
    defineField({ name: "upholstery", title: "Fabric types available", type: "array", group: "basics", of: [{ type: "string" }],
      options: { list: [
        { title: "Velvet", value: "velvet" }, { title: "Linen", value: "linen" }, { title: "Fabric", value: "fabric" },
        { title: "Leatherette", value: "leatherette" }, { title: "Leather", value: "leather" },
      ] } }),

    defineField({ name: "images", title: "Photos (first one is the cover)", type: "array", group: "photos", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "roomImages", title: "Room-setting photos (add as many as you like)", type: "array", group: "photos",
  of: [{ type: "image", options: { hotspot: true } }],
  description: "Photos of this sofa in a real room. Wide landscape photos work best." }),
  
    defineField({ name: "length", title: "Length (inches)", type: "number", group: "specs" }),
    defineField({ name: "depth", title: "Depth (inches)", type: "number", group: "specs" }),
    defineField({ name: "height", title: "Height (inches)", type: "number", group: "specs" }),
    defineField({ name: "seatHeight", title: "Seat height (inches)", type: "number", group: "specs" }),
    defineField({ name: "sizeNote", title: "Size note (for L-shape and corner)", type: "localeString", group: "specs" }),
    defineField({ name: "frame", title: "Frame", type: "localeString", group: "specs" }),
    defineField({ name: "foam", title: "Cushion / foam", type: "localeString", group: "specs" }),
    defineField({ name: "base", title: "Legs / base", type: "localeString", group: "specs" }),

    defineField({ name: "swatches", title: "Colours and fabrics", type: "array", group: "options", of: [defineArrayMember({ type: "swatch" })] }),
    defineField({ name: "customSize", title: "Size can be changed", type: "boolean", group: "options", initialValue: true }),
    defineField({ name: "customFabric", title: "Fabric and colour can be changed", type: "boolean", group: "options", initialValue: true }),
    defineField({ name: "customNote", title: "Customising note", type: "localeString", group: "options" }),

    defineField({ name: "leadTime", title: "Time to make", type: "localeString", group: "delivery", description: "For example: 2 to 3 weeks" }),
    defineField({ name: "assembly", title: "We set it up at the customer's home", type: "boolean", group: "delivery", initialValue: true }),
    defineField({ name: "warranty", title: "Warranty", type: "localeString", group: "delivery" }),
    defineField({ name: "care", title: "Care instructions", type: "localeText", group: "delivery" }),

    defineField({ name: "badge", title: "Badge", type: "string", group: "control", initialValue: "none",
      options: { list: [{ title: "None", value: "none" }, { title: "Bestseller", value: "bestseller" }, { title: "New", value: "new" }] } }),
    defineField({ name: "madeToOrder", title: "Made to order", type: "boolean", group: "control", initialValue: true }),
    defineField({ name: "related", title: "Related models", type: "array", group: "control", of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })] }),
    defineField({ name: "hidden", title: "Hide from website", type: "boolean", group: "control", initialValue: false }),
  ],
  preview: { select: { title: "name.en", subtitle: "code", media: "images.0" } },
});

export const schemaTypes = [localeString, localeText, swatch, product];
