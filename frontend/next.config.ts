import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // OP_NET packages reference Node.js built-ins that need fallbacks in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        buffer: false,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        zlib: false,
      };
    }

    // Ignore .LICENSE.txt files
    config.module.rules.push({
      test: /\.LICENSE\.txt$/,
      type: 'asset/source',
    });

    return config;
  },
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
