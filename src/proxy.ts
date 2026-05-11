/**
 * Proxy – xử lý locale, rewrite, và auth presence gate.
 *
 * Sử dụng `createMiddleware` từ next-intl để đảm bảo locale
 * được set đúng qua request headers (x-next-intl-locale),
 * sau đó áp dụng thêm logic rewrite + auth presence gate.
 */
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getLocaleFromPathname,
  localizePath,
  stripLocale,
  type Locale,
} from "@/i18n/config";
import { routing } from "@/i18n/routing";

const ACCESS_TOKEN_KEY = "emerald-logistics.access-token";
const REFRESH_TOKEN_KEY = "emerald-logistics.refresh-token";
const PROTECTED_PATHS = [
  "/admin",
  "/checkout",
  "/driver",
  "/dashboard",
  "/notifications",
  "/orders",
  "/overview",
  "/profile",
  "/role-requests",
  "/warehouse",
] as const;

const CUSTOMER_DASHBOARD_REDIRECTS = {
  "/dashboard/customer": "/overview",
  "/dashboard/customer/orders": "/orders",
  "/dashboard/customer/settings": "/profile",
  "/dashboard/customer/roles": "/role-requests",
} as const;

const LEGACY_DASHBOARD_REDIRECTS = {
  "/dashboard/admin": "/admin",
  "/dashboard/driver": "/driver",
  "/dashboard/warehouse": "/warehouse",
  ...CUSTOMER_DASHBOARD_REDIRECTS,
} as const;

const CUSTOMER_ROUTE_REDIRECTS = {
  "/customer": "/overview",
  "/customer/notifications": "/notifications",
  "/customer/orders": "/orders",
  "/customer/orders/create": "/orders/create",
  "/customer/overview": "/overview",
  "/customer/profile": "/profile",
  "/customer/role-requests": "/role-requests",
} as const;

/**
 * next-intl middleware xử lý locale detection, redirect locale prefix,
 * và set header x-next-intl-locale để server components nhận đúng locale.
 */
const intlMiddleware = createIntlMiddleware(routing);

function isPathWithin(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Kiểm tra path có cần xác thực hay không */
function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => isPathWithin(pathname, path));
}

/** Lấy canonical path mới nếu là legacy /dashboard URL */
function getLegacyDashboardRedirect(pathname: string) {
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  for (const [legacyPrefix, canonicalPrefix] of Object.entries(
    LEGACY_DASHBOARD_REDIRECTS,
  ).sort(([left], [right]) => right.length - left.length)) {
    if (
      isPathWithin(normalizedPath, legacyPrefix)
    ) {
      return `${canonicalPrefix}${normalizedPath.slice(legacyPrefix.length)}`;
    }
  }

  return null;
}

/** Lấy redirect path nếu là customer route cũ có segment /customer */
function getCustomerRouteRedirect(pathname: string) {
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  return (
    CUSTOMER_ROUTE_REDIRECTS[
      normalizedPath as keyof typeof CUSTOMER_ROUTE_REDIRECTS
    ] ?? null
  );
}

/** Tạo URL đã localize kèm query params */
function createLocalizedUrl(
  request: NextRequest,
  destination: string,
  locale: Locale,
) {
  const targetUrl = new URL(localizePath(destination, locale), request.url);
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });
  return targetUrl;
}

/** Redirect đến path đã localize */
function redirectToPath(
  request: NextRequest,
  destination: string,
  locale: Locale,
  status?: 307 | 308,
) {
  const url = createLocalizedUrl(request, destination, locale);
  return status ? NextResponse.redirect(url, status) : NextResponse.redirect(url);
}

/**
 * Main proxy function – entry point cho Next.js middleware.
 *
 * Flow:
 * 1. Gọi intlMiddleware trước để xử lý locale (set headers, redirect prefix).
 * 2. Nếu intlMiddleware đã redirect → trả về luôn.
 * 3. Áp dụng custom logic: rewrite Google callback, legacy redirects, auth presence gate.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname);

  // Nếu chưa có locale prefix → intlMiddleware sẽ redirect tự động
  if (!locale) {
    return intlMiddleware(request);
  }

  const normalizedPathname = stripLocale(pathname);

  // Rewrite legacy Google OAuth callback path
  if (normalizedPathname === "/auth/google/callback") {
    const callbackUrl = createLocalizedUrl(request, "/auth/google-callback", locale);
    request.nextUrl.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.rewrite(callbackUrl);
  }

  const customerRouteRedirect = getCustomerRouteRedirect(normalizedPathname);

  if (customerRouteRedirect) {
    return redirectToPath(request, customerRouteRedirect, locale);
  }

  const legacyDashboardRedirect =
    getLegacyDashboardRedirect(normalizedPathname);

  if (legacyDashboardRedirect) {
    return redirectToPath(request, legacyDashboardRedirect, locale, 308);
  }

  // Route không cần bảo vệ → chạy intlMiddleware để set locale headers
  if (!isProtectedPath(normalizedPathname)) {
    return intlMiddleware(request);
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value ?? null;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value ?? null;

  if (!accessToken && !refreshToken) {
    return redirectToPath(request, "/auth/login", locale);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
