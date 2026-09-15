/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    isrMemoryCacheSize: 0, // Disable ISR to avoid prerendering issues
  },
};

module.exports = nextConfig;
