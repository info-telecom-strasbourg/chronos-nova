import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@chronos/ui", "@chronos/db", "@chronos/env"],
};

export default nextConfig;
