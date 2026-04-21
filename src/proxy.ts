import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  decodeAccessTokenPayload,
  getDashboardHrefForRole,
  normalizeUserRole,
} from "@/features/auth/application/services/auth-session";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";

const ACCESS_TOKEN_KEY = "emerald-logistics.access-token";
const PROTECTED_PATHS = ["/checkout", "/dashboard", "/orders/create"] as const;

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const payload = decodeAccessTokenPayload(accessToken);
  const role = normalizeUserRole(payload?.roleName, payload?.roleId);

  if (!role) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(getDashboardHrefForRole(role), request.url));
  }

  if (pathname.startsWith("/dashboard/admin") && !ROUTE_PERMISSIONS.ADMIN.includes(role)) {
    return NextResponse.redirect(new URL(getDashboardHrefForRole(role), request.url));
  }

  if (pathname.startsWith("/dashboard/driver") && !ROUTE_PERMISSIONS.DRIVER.includes(role)) {
    return NextResponse.redirect(new URL(getDashboardHrefForRole(role), request.url));
  }

  if (
    pathname.startsWith("/dashboard/warehouse") &&
    !ROUTE_PERMISSIONS.WAREHOUSE.includes(role)
  ) {
    return NextResponse.redirect(new URL(getDashboardHrefForRole(role), request.url));
  }

  if (pathname.startsWith("/dashboard/customer") && !ROUTE_PERMISSIONS.CUSTOMER.includes(role)) {
    return NextResponse.redirect(new URL(getDashboardHrefForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
