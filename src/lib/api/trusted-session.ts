import "server-only";

import { cache } from "react";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { toAuthProfile } from "@/features/auth/application/services/auth-session";
import type { AuthProfileDto } from "@/features/auth/domain/types/auth.types";
import type { SessionBootstrapPayload, SessionTokens } from "@/types/common.type";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
  createForwardedAuthHeaders,
  getBackendBaseUrl,
} from "@/lib/api/server-session";

export type TrustedSession = SessionBootstrapPayload & {
  refreshed: boolean;
  refreshToken?: string | null;
};

type ResolveTrustedSessionInput = {
  accessToken?: string | null;
  forwardedHeaders?: Headers;
  refreshToken?: string | null;
};

function getAuthHeaders(accessToken: string, forwardedHeaders?: Headers) {
  const requestHeaders = new Headers(forwardedHeaders);
  requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  return requestHeaders;
}

async function fetchProfile(
  accessToken: string,
  forwardedHeaders?: Headers,
) {
  const response = await fetch(new URL("/auth/profile", getBackendBaseUrl()), {
    cache: "no-store",
    headers: getAuthHeaders(accessToken, forwardedHeaders),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as AuthProfileDto;

  return toAuthProfile(payload, { verifiedAccessToken: accessToken });
}

async function refreshTokens(
  refreshToken: string,
  forwardedHeaders?: Headers,
) {
  const response = await fetch(new URL("/auth/refresh-token", getBackendBaseUrl()), {
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
    headers: forwardedHeaders ?? new Headers(),
    method: "POST",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SessionTokens;
}

export async function resolveTrustedSession({
  accessToken,
  forwardedHeaders,
  refreshToken,
}: ResolveTrustedSessionInput): Promise<TrustedSession | null> {
  if (accessToken) {
    const profile = await fetchProfile(accessToken, forwardedHeaders);

    if (profile) {
      return {
        accessToken,
        profile,
        refreshToken,
        refreshed: false,
      };
    }
  }

  if (!refreshToken) {
    return null;
  }

  const refreshedTokens = await refreshTokens(refreshToken, forwardedHeaders);

  if (!refreshedTokens?.accessToken) {
    return null;
  }

  const profile = await fetchProfile(refreshedTokens.accessToken, forwardedHeaders);

  if (!profile) {
    return null;
  }

  return {
    accessToken: refreshedTokens.accessToken,
    profile,
    refreshToken: refreshedTokens.refreshToken ?? refreshToken,
    refreshed: true,
  };
}

export async function resolveTrustedSessionFromRequest(request: NextRequest) {
  return resolveTrustedSession({
    accessToken: request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)?.value ?? null,
    forwardedHeaders: createForwardedAuthHeaders(request.headers),
    refreshToken: request.cookies.get(REFRESH_TOKEN_COOKIE_KEY)?.value ?? null,
  });
}

export const getCachedTrustedSession = cache(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return resolveTrustedSession({
    accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value ?? null,
    forwardedHeaders: createForwardedAuthHeaders(headerStore),
    refreshToken: cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value ?? null,
  });
});
