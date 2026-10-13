import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // 1. Redirect legacy root locale paths (/en, /ml) -> /
      {
        source: "/:locale(en|ml)",
        destination: "/",
        permanent: true,
      },
      // 2. Redirect legacy sub-paths (/en/models, /ml/product/sofa-slug) -> /models, /product/sofa-slug
      {
        source: "/:locale(en|ml)/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;