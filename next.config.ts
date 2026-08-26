import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.mazoom.online',
        pathname: '/**', 
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);