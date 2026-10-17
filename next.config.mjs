/** @type {import('next').NextConfig} */
let nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Production uses the optimizer; keep formats + qualities for LCP budget.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      // CC0 stock photos for blog covers (agent-hub image search via Openverse).
      {
        protocol: "https",
        hostname: "cdn.stocksnap.io",
      },
      {
        protocol: "https",
        hostname: "images.rawpixel.com",
      },
    ],
  },
  // Site-wide security headers (previously set in proxy.ts alongside the
  // removed /admin auth gate).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/work/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
      // Admin panel and login were removed; send old bookmarks home.
      { source: "/admin/:path*", destination: "/", permanent: true },
      { source: "/login", destination: "/", permanent: true },
    ]
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
