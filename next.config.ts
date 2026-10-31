import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module and must not be bundled by webpack/turbopack.
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      {
        source: '/learn',
        destination: '/unddev',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
