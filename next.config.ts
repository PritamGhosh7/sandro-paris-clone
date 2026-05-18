import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eu.sandro-paris.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.sandro-paris.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
