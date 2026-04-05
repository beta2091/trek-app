import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow a separate build cache dir when running a parallel preview
  // so it doesn't collide with another running `next dev` on the same project.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
