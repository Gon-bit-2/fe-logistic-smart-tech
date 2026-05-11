import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
  applySessionCookies,
  callBackendAuthEndpoint,
  clearSessionCookies,
  getForwardedAuthHeaders,
} from "@/lib/api/server-session";
import { resolveTrustedSessionFromRequest } from "@/lib/api/trusted-session";
import type { SessionBootstrapPayload } from "@/types/common.type";

function toEmptySessionResponse() {
  const response = new NextResponse(null, {
    headers: {
      "Cache-Control": "no-store",
    },
    status: 204,
  });

  clearSessionCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  const session = await resolveTrustedSessionFromRequest(request);

  if (!session) {
    return toEmptySessionResponse();
  }

  const response = NextResponse.json(
    {
      accessToken: session.accessToken,
      profile: session.profile,
    } satisfies SessionBootstrapPayload,
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

  if (session.refreshed) {
    applySessionCookies(response, request, {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
  }

  return response;
}

export async function DELETE(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_KEY)?.value ?? null;

  if (refreshToken) {
    try {
      await callBackendAuthEndpoint(request, "/auth/logout", {
        body: JSON.stringify({ refreshToken }),
        headers: getForwardedAuthHeaders(request),
        method: "POST",
      });
    } catch {
      // Ignore backend logout failures and clear the browser session regardless.
    }
  }

  const response = NextResponse.json(
    { message: "Đăng Xuất Thành Công" },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

  clearSessionCookies(response);

  return response;
}
