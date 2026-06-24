import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Fija la raíz al propio proyecto (hay otro lockfile en ~/) para que el
  // tracing del build standalone no suba a /Users/Mauri.
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  images: {
    // Imágenes locales ya optimizadas (webp/png). Evita depender de sharp en el LXC.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
