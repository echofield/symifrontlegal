/** @type {import('next').NextConfig} */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || "http://localhost:3001";

const nextConfig = {
  turbopack: { root: __dirname },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: API_BASE_URL,
  },
};

module.exports = nextConfig;
