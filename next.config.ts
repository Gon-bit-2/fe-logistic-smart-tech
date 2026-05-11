import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const distDir = process.env.NEXT_DIST_DIR?.trim();
const publicApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
const isProduction = process.env.NODE_ENV === "production";

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

function createOrigin(value?: string | null) {
  const normalized = normalizeEnvValue(value);

  if (!normalized) {
    return null;
  }

  try {
    return new URL(normalized).origin;
  } catch {
    return null;
  }
}

function createWebsocketOrigin(value?: string | null) {
  const origin = createOrigin(value);

  if (!origin) {
    return null;
  }

  try {
    const url = new URL(origin);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url.origin;
  } catch {
    return null;
  }
}

function dedupeSources(sources: Array<string | null | undefined>) {
  return [...new Set(sources.filter((source): source is string => Boolean(source)))];
}

function createContentSecurityPolicyReportOnly() {
  const apiOrigin = createOrigin(publicApiBaseUrl);
  const websocketOrigin = createWebsocketOrigin(publicApiBaseUrl);
  const directives: Array<[string, string[]]> = [
    ["default-src", ["'self'"]],
    ["base-uri", ["'self'"]],
    ["frame-ancestors", ["'none'"]],
    ["form-action", ["'self'"]],
    ["object-src", ["'none'"]],
    [
      "script-src",
      dedupeSources([
        "'self'",
        "'unsafe-inline'",
        ...(!isProduction ? ["'unsafe-eval'"] : []),
        "https://cdn.jsdelivr.net",
        "https://js.stripe.com",
      ]),
    ],
    [
      "style-src",
      dedupeSources([
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
      ]),
    ],
    [
      "img-src",
      dedupeSources([
        "'self'",
        "blob:",
        "data:",
        "https://lh3.googleusercontent.com",
        "https://*.googleusercontent.com",
        "https://tiles.goong.io",
        "https://*.stripe.com",
      ]),
    ],
    ["font-src", ["'self'", "data:", "https://fonts.gstatic.com"]],
    [
      "connect-src",
      dedupeSources([
        "'self'",
        apiOrigin,
        websocketOrigin,
        "https://tiles.goong.io",
        "https://api.stripe.com",
        "https://js.stripe.com",
        "https://m.stripe.network",
        "https://r.stripe.com",
      ]),
    ],
    ["worker-src", ["'self'", "blob:"]],
    ["manifest-src", ["'self'"]],
    ["report-uri", ["/api/security/csp-report"]],
  ];

  return directives
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");
}

const apiRemotePattern = createRemotePattern(publicApiBaseUrl);
const contentSecurityPolicyReportOnly = createContentSecurityPolicyReportOnly();
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicyReportOnly,
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
] as const;

const nextConfig: NextConfig = {
  ...(distDir ? { distDir } : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.your-cdn.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      ...(apiRemotePattern ? [apiRemotePattern] : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
