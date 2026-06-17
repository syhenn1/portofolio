import type { NextConfig } from "next";
import { basePath } from "./lib/basePath";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: isProd ? "/portofolio/" : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
