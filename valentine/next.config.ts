import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "media.giphy.com",
            },
            {
                protocol: "https",
                hostname: "media*.giphy.com",
            },
        ],
    },
};

export default nextConfig;
