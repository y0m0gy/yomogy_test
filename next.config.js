/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    optimized: true,
  },
  // basePath: process.env.NODE_ENV === "development" ? "" : "/main", // Sub directory
  // assetPrefix: process.env.NODE_ENV === "development" ? undefined : "/main/", // Nginx
};

module.exports = nextConfig;
