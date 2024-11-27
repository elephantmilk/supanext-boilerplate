import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let supabaseImageBucket = process.env.NEXT_PUBLIC_SUPABASE_URL;
supabaseImageBucket = supabaseImageBucket?.replace("https://", "") || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Webpack-Konfiguration entfernen
  // webpack: (config) => { ... },
  // Stattdessen Turbopack konfigurieren
  experimental: {
    turbo: {
      resolveAlias: {
        "@": path.resolve(__dirname),
        "@/components": path.resolve(__dirname, "components"),
        "@/lib": path.resolve(__dirname, "lib"),
      },
    },
    serverActions: {
      allowedOrigins: ["localhost:3000"],
      bodySizeLimit: "2mb"
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      {
        hostname: supabaseImageBucket,
        protocol: "https",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'utf-8-validate': false,
        bufferutil: false,
      };
    }
    return config;
  },
};

export default nextConfig;
