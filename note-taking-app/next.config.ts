import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/engines',
    'prisma',
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Prisma for the client
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@prisma/client': false,
        'prisma': false,
        '@prisma/engines': false,
      };
    } else {
      // Make Prisma external on the server
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@prisma/client', 'prisma');
      }
    }
    return config;
  },
};

export default nextConfig;
