import type { NextConfig } from "next";

// On GitHub Pages a project site is served from /<repo>, so we need a basePath.
// The deploy workflow sets PAGES_BASE_PATH to the repo name automatically, so this
// adapts even if you rename the repo. Locally it's empty (served from /).
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // static HTML export for GitHub Pages
  basePath,
  images: { unoptimized: true }, // next/image can't optimize on a static host
  trailingSlash: true,
};

export default nextConfig;
