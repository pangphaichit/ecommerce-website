import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["ifqkafzvefjruoapkrdq.supabase.co", "api.dicebear.com"],
  },
};

export default nextConfig;
