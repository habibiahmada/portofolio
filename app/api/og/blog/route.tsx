import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site-metadata";

/**
 * Dynamic OG image for blog posts (Task 5.1-5.4).
 * Route: GET /api/og/blog?title=...&category=...
 * Returns a PNG with sensible cache headers.
 */

const CATEGORY_COLORS: Record<string, string> = {
  programming: "#3b82f6",
  education: "#10b981",
  web: "#8b5cf6",
  career: "#f59e0b",
  opinion: "#f43f5e",
  "news-commentary": "#06b6d4",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Blog Post";
  const category = searchParams.get("category") ?? "programming";

  const accentColor = CATEGORY_COLORS[category] ?? "#ef4444";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "#fafafa",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: accentColor,
          }}
        />

        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accentColor,
              background: `${accentColor}15`,
              padding: "6px 16px",
              borderRadius: 999,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {category.replace("-", " ")}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? 40 : 52,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Author + site */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: "auto",
          }}
        >
          {/* Profile image placeholder circle */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            HA
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {SITE.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#a1a1aa",
                fontWeight: 500,
              }}
            >
              {SITE.url.replace("https://", "")}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
