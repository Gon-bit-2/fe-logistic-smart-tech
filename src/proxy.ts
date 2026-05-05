/**
 * Middleware proxy – xử lý locale + RBAC routing.
 *
 * Sử dụng `createMiddleware` từ next-intl để đảm bảo locale
 * được set đúng qua request headers (x-next-intl-locale),
 * sau đó áp dụng thêm logic bảo vệ route theo role.
 */
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  decodeAccessTokenPayload,
  getDashboardHrefForRole,
  normalizeUserRole,
} from "@/features/auth/application/services/auth-session";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import {
  getLocaleFromPathname,
  localizePath,
  stripLocale,
  type Locale,
} from "@/i18n/config";
import { routing } from "@/i18n/routing";

const ACCESS_TOKEN_KEY = "emerald-logistics.access-token";
const PROTECTED_PATHS = [
  "/checkout",
  "/dashboard",
  "/notifications",
  "/orders",
  "/overview",
  "/profile",
  "/role-requests",
] as const;
const CUSTOMER_ROOT_PATHS = [
  "/checkout",
  "/notifications",
  "/orders",
  "/overview",
  "/profile",
  "/role-requests",
] as const;

const CUSTOMER_DASHBOARD_REDIRECTS = {
  "/dashboard/customer": "/overview",
  "/dashboard/customer/orders": "/orders",
  "/dashboard/customer/settings": "/profile",
  "/dashboard/customer/roles": "/role-requests",
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

/** Kiểm tra path có cần xác thực hay không */
function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

/** Kiểm tra path thuộc nhóm route customer */
function isCustomerRootPath(pathname: string) {
  return CUSTOMER_ROOT_PATHS.some((path) => pathname.startsWith(path));
}

/** Lấy redirect path nếu là legacy customer dashboard URL */
function getCustomerDashboardRedirect(pathname: string) {
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  return (
    CUSTOMER_DASHBOARD_REDIRECTS[
      normalizedPath as keyof typeof CUSTOMER_DASHBOARD_REDIRECTS
    ] ?? null
  );
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
) {
  return NextResponse.redirect(createLocalizedUrl(request, destination, locale));
}

/**
 * Main proxy function – entry point cho Next.js middleware.
 *
 * Flow:
 * 1. Gọi intlMiddleware trước để xử lý locale (set headers, redirect prefix).
 * 2. Nếu intlMiddleware đã redirect → trả về luôn.
 * 3. Áp dụng custom logic: rewrite Google callback, RBAC protection.
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

  // Route không cần bảo vệ → chạy intlMiddleware để set locale headers
  if (!isProtectedPath(normalizedPathname)) {
    return intlMiddleware(request);
  }

  // --- Từ đây là protected routes, cần kiểm tra auth ---

  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  if (!accessToken) {
    return redirectToPath(request, "/auth/login", locale);
  }

  const payload = decodeAccessTokenPayload(accessToken);
  const role = normalizeUserRole(payload?.roleName, payload?.roleId);

  if (!role) {
    return redirectToPath(request, "/auth/login", locale);
  }

  // Redirect /dashboard → dashboard tương ứng theo role
  if (normalizedPathname === "/dashboard") {
    return redirectToPath(request, getDashboardHrefForRole(role), locale);
  }

  // Admin có quyền truy cập mọi route → chạy intlMiddleware để set locale
  if (ROUTE_PERMISSIONS.ADMIN.includes(role)) {
    return intlMiddleware(request);
  }

  // Xử lý redirect từ legacy customer dashboard URLs
  const customerDashboardRedirect = getCustomerDashboardRedirect(normalizedPathname);

  if (customerDashboardRedirect) {
    if (!ROUTE_PERMISSIONS.CUSTOMER.includes(role)) {
      return redirectToPath(request, getDashboardHrefForRole(role), locale);
    }

    return redirectToPath(request, customerDashboardRedirect, locale);
  }

  // Customer root paths: chặn nếu không phải customer
  if (
    isCustomerRootPath(normalizedPathname) &&
    !ROUTE_PERMISSIONS.CUSTOMER.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role), locale);
  }

  // Route không phải dashboard → cho qua với intlMiddleware
  if (!normalizedPathname.startsWith("/dashboard")) {
    return intlMiddleware(request);
  }

  // Kiểm tra quyền truy cập các workspace dashboard cụ thể
  if (
    normalizedPathname.startsWith("/dashboard/admin") &&
    !ROUTE_PERMISSIONS.ADMIN.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role), locale);
  }

  if (
    normalizedPathname.startsWith("/dashboard/driver") &&
    !ROUTE_PERMISSIONS.DRIVER.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role), locale);
  }

  if (
    normalizedPathname.startsWith("/dashboard/warehouse") &&
    !ROUTE_PERMISSIONS.WAREHOUSE.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role), locale);
  }

  if (
    normalizedPathname.startsWith("/dashboard/customer") &&
    !ROUTE_PERMISSIONS.CUSTOMER.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role), locale);
  }

  // Mọi route còn lại → cho qua với intlMiddleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
