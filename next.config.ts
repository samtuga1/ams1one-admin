import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["8fb0-154-160-18-12.ngrok-free.app", "54b8-154-160-19-96.ngrok-free.app", "192.168.100.76"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ams1onecore-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "onassismystrocore-production.up.railway.app",
      },
      {
        protocol: "http",
        hostname: "*.ngrok-free.dev",
      },
      {
        protocol: "https",
        hostname: "*.ngrok-free.app",
      },
    ],
  },
};

export default nextConfig;
