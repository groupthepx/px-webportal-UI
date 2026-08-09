import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'px-spaces.sgp1.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'px-api.mooo.com',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    contentDispositionType: 'inline',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Output Configuration
  output: 'standalone',

  // Compiler Options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Compression
  compress: true,

  // Performance Optimizations
  poweredByHeader: false,
  
  // React Strict Mode
  reactStrictMode: true,

  // Experimental Features
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // Turbopack Configuration
  turbopack: {},

  // Webpack Configuration (ถ้าจำเป็น)
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
