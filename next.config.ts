import type { NextConfig } from "next";

// Next.js app-এ React Compiler ও Tailwind CSS-এর Turbopack loader চালু করে।
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
