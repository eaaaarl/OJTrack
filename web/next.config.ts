import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.geoapify.com",
        pathname: "/v1/staticmap/**",
      },
      {
        protocol: "https",
        hostname: "scsvubvhdtbizuacizty.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
