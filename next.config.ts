import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone', // Для Docker deployment
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'nemereadocfinderdoctorandclinicsimages.s3.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
