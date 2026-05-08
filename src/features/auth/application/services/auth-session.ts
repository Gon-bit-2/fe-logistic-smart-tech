import {
  ROLE_ID_MAP,
  type AccessTokenPayload,
  type AuthProfile,
  type AuthProfileDto,
  type AuthUser,
  type UserRole,
} from "@/features/auth/domain/types/auth.types";

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/admin",
  customer: "/overview",
  driver: "/driver",
  warehouse_staff: "/warehouse",
};

const NOTIFICATION_REDIRECTS: Record<UserRole, string> = {
  admin: "/admin/notifications",
  customer: "/notifications",
  driver: "/driver/notifications",
  warehouse_staff: "/warehouse/notifications",
};

const ROLE_REQUEST_REDIRECTS: Record<UserRole, string> = {
  admin: "/admin/role-requests",
  customer: "/role-requests",
  driver: "/driver/roles",
  warehouse_staff: "/warehouse/roles",
};

const PROFILE_REDIRECTS: Record<UserRole, string> = {
  admin: "/admin",
  customer: "/profile",
  driver: "/driver",
  warehouse_staff: "/warehouse",
};

function base64UrlToUtf8(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");

  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }

  const ascii = globalThis.atob(base64);
  const bytes = Uint8Array.from(ascii, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function normalizeUserRole(
  roleName?: string | null,
  roleId?: number | null,
): UserRole | null {
  if (roleId != null && ROLE_ID_MAP[roleId]) {
    return ROLE_ID_MAP[roleId];
  }

  if (!roleName) {
    return null;
  }

  const normalized = roleName.trim().toLowerCase();

  if (normalized === "admin") {
    return "admin";
  }

  if (normalized === "customer") {
    return "customer";
  }

  if (normalized === "driver") {
    return "driver";
  }

  if (normalized === "warehouse_staff") {
    return "warehouse_staff";
  }

  return null;
}

export function getDashboardHrefForRole(role?: UserRole | null): string {
  return role ? ROLE_REDIRECTS[role] : "/overview";
}

export function getNotificationsHrefForRole(role?: UserRole | null): string {
  return role ? NOTIFICATION_REDIRECTS[role] : "/notifications";
}

export function getRoleRequestHrefForRole(role?: UserRole | null): string {
  return role ? ROLE_REQUEST_REDIRECTS[role] : "/role-requests";
}

export function getProfileHrefForRole(role?: UserRole | null): string {
  return role ? PROFILE_REDIRECTS[role] : "/profile";
}

export function decodeAccessTokenPayload(
  token: string,
): AccessTokenPayload | null {
  try {
    const encodedPayload = token.split(".")[1];

    if (!encodedPayload) {
      return null;
    }

    const payload = JSON.parse(
      base64UrlToUtf8(encodedPayload),
    ) as AccessTokenPayload;

    if (typeof payload.exp !== "number") {
      return null;
    }

    const currentEpoch = Math.floor(Date.now() / 1000);

    if (payload.exp <= currentEpoch) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isAccessTokenExpiringSoon(
  token: string,
  clockSkewSeconds = 30,
) {
  try {
    const encodedPayload = token.split(".")[1];

    if (!encodedPayload) {
      return true;
    }

    const payload = JSON.parse(
      base64UrlToUtf8(encodedPayload),
    ) as AccessTokenPayload;

    if (typeof payload.exp !== "number") {
      return true;
    }

    const currentEpoch = Math.floor(Date.now() / 1000);
    return payload.exp <= currentEpoch + clockSkewSeconds;
  } catch {
    return true;
  }
}

export function extractAuthUserFromToken(token: string): AuthUser | null {
  const payload = decodeAccessTokenPayload(token);

  if (!payload) {
    return null;
  }

  const role = normalizeUserRole(payload.roleName, payload.roleId);

  if (!role) {
    return null;
  }

  return {
    hubId: payload.hubId ?? null,
    id: payload.userId,
    role,
    roleId: payload.roleId,
  };
}

export function toAuthProfile(dto: AuthProfileDto): AuthProfile {
  const role = normalizeUserRole(dto.roleName, dto.roleId) ?? "customer";
  const fullName = dto.fullName?.trim() || dto.email;
  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() ?? "")
      .join("") || "NA";

  return {
    avatarUrl: dto.avatar ?? dto.avatarUrl ?? null,
    email: dto.email,
    fullName,
    hubId: dto.hubId ?? null,
    id: dto.id,
    initials,
    phone: dto.phone ?? null,
    role,
    roleId: dto.roleId,
  };
}
