import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',          // usually empty
        pathname: '/**',   // allow all paths under that domain
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',          // usually empty
        pathname: '/**',   // allow all paths under that domain
      },
    ],
  },
};

export default nextConfig;
