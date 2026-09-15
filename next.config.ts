import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        // Restrict optimization to this Cloudinary product environment rather
        // than allowing every tenant on Cloudinary's shared delivery host.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dsrsreyj/**',
            },
        ],
    },
};

export default nextConfig;
