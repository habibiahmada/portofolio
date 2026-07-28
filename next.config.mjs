/** @type {import('next').NextConfig} */
let nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [60, 75],
  },
  allowedDevOrigins: ["127.0.0.1", "192.168.43.152"],
};

// Bundle analyzer — run: ANALYZE=true bun run build
// ponytail: only run when chasing bundle size; disabled by default
if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

export default nextConfig;
