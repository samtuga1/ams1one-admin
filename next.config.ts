import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ams1onecore-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "s3.eu-west-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
