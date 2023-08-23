/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
    GA_ADSENSE_ID: process.env.GA_ADSENSE_ID,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    GITHUB_POST_BASE_URL: process.env.GITHUB_POST_BASE_URL,
  },
  // basePath: process.env.NODE_ENV === "development" ? "" : "/main", // Sub directory
  // assetPrefix: process.env.NODE_ENV === "development" ? undefined : "/main/", // Nginx
};

module.exports = nextConfig;
