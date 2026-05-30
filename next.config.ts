import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// GitHub Pages: repo = syhenn1/portofolio → deployed at /portofolio/
const basePath = isProd ? "/portofolio" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: isProd ? "/portofolio/" : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
