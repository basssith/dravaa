import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // 90 keeps UI screenshot text crisp; 75 (the default) blurs it.
    qualities: [75, 90]
  }
};

export default nextConfig;
