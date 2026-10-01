import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Product URLs used to end in "1" (e.g. /products/electric-drill1).
    return [
      {
        source: "/products/:slug(electric-drill|angle-grinder|tool-set|safety-helmet)1",
        destination: "/products/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
