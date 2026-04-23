import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  decodeAccessTokenPayload,
  getDashboardHrefForRole,
  normalizeUserRole,
} from "@/features/auth/application/services/auth-session";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";

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

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function isCustomerRootPath(pathname: string) {
  return CUSTOMER_ROOT_PATHS.some((path) => pathname.startsWith(path));
}

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

function redirectToPath(request: NextRequest, destination: string) {
  return NextResponse.redirect(new URL(destination, request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/auth/google/callback") {
    const callbackUrl = new URL("/auth/google-callback", request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.rewrite(callbackUrl);
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const payload = decodeAccessTokenPayload(accessToken);
  const role = normalizeUserRole(payload?.roleName, payload?.roleId);

  if (!role) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/dashboard") {
    return redirectToPath(request, getDashboardHrefForRole(role));
  }

  if (ROUTE_PERMISSIONS.ADMIN.includes(role)) {
    return NextResponse.next();
  }

  const customerDashboardRedirect = getCustomerDashboardRedirect(pathname);

  if (customerDashboardRedirect) {
    if (!ROUTE_PERMISSIONS.CUSTOMER.includes(role)) {
      return redirectToPath(request, getDashboardHrefForRole(role));
    }

    const targetUrl = new URL(customerDashboardRedirect, request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(targetUrl);
  }

  if (
    isCustomerRootPath(pathname) &&
    !ROUTE_PERMISSIONS.CUSTOMER.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role));
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/dashboard/admin") &&
    !ROUTE_PERMISSIONS.ADMIN.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role));
  }

  if (
    pathname.startsWith("/dashboard/driver") &&
    !ROUTE_PERMISSIONS.DRIVER.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role));
  }

  if (
    pathname.startsWith("/dashboard/warehouse") &&
    !ROUTE_PERMISSIONS.WAREHOUSE.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role));
  }

  if (
    pathname.startsWith("/dashboard/customer") &&
    !ROUTE_PERMISSIONS.CUSTOMER.includes(role)
  ) {
    return redirectToPath(request, getDashboardHrefForRole(role));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
