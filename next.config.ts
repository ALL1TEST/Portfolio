import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xngpgftvnadjtztkvkgc.supabase.co',
        pathname: '/storage/v1/object/public/uploads/**',
      },
    ],
  },
};

export default nextConfig;
