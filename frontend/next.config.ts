import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Ignore TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ WebAssembly settings
  webpack(config, { isServer }) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },
};

export default nextConfig;
