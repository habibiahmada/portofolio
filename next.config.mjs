/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [60, 75],
  },
  allowedDevOrigins: ["127.0.0.1", "192.168.43.152"],
};

export default nextConfig;
