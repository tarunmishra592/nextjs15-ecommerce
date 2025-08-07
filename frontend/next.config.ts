import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: 'https://nextjs15-ecommerce-sooty.vercel.app' 
          },
          { 
            key: 'Access-Control-Allow-Credentials', 
            value: 'true' 
          }
        ]
      }
    ];
  },
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
