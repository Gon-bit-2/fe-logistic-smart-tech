import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const distDir = process.env.NEXT_DIST_DIR?.trim();
const publicApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

function normalizeEnvValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function createRemotePattern(value?: string | null) {
  const normalized = normalizeEnvValue(value);

  if (!normalized) {
    return null;
  }

  try {
    const url = new URL(normalized);
    const protocol =
      url.protocol === "https:" ? "https" : url.protocol === "http:" ? "http" : null;

    if (!protocol) {
      return null;
    }

    return {
      protocol,
      hostname: url.hostname,
      pathname: "/**",
      port: url.port || undefined,
    } as const;
  } catch {
    return null;
  }
}

const apiRemotePattern = createRemotePattern(publicApiBaseUrl);

const nextConfig: NextConfig = {
  ...(distDir ? { distDir } : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.your-cdn.com" },
      ...(apiRemotePattern ? [apiRemotePattern] : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
