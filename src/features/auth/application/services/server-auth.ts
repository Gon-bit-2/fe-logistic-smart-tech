import "server-only";

import { redirect } from "next/navigation";
import { getDashboardHrefForRole } from "@/features/auth/application/services/auth-session";
import type { UserRole } from "@/features/auth/domain/types/auth.types";
import { getCachedTrustedSession } from "@/lib/api/trusted-session";
import { localizePath, type Locale } from "@/i18n/config";

export async function requireAuthenticatedSession(locale: Locale) {
  const session = await getCachedTrustedSession();

  if (!session) {
    redirect(localizePath("/auth/login", locale));
  }

  return session;
}

export async function requireRole(
  locale: Locale,
  allowedRoles: readonly UserRole[],
) {
  const session = await requireAuthenticatedSession(locale);

  if (!allowedRoles.includes(session.profile.role)) {
    redirect(localizePath(getDashboardHrefForRole(session.profile.role), locale));
  }

  return session;
}
