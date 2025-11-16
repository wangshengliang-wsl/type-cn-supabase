import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-main.aiyeshi.cn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
