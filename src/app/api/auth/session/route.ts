import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
  applySessionCookies,
  callBackendAuthEndpoint,
  clearSessionCookies,
  getForwardedAuthHeaders,
  isTokenExpired,
} from "@/lib/api/server-session";
import type { SessionTokens } from "@/types/common.type";

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
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)?.value ?? null;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_KEY)?.value ?? null;

  if (accessToken && !isTokenExpired(accessToken, 30)) {
    return NextResponse.json(
      { accessToken } satisfies SessionTokens,
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (!refreshToken) {
    return toEmptySessionResponse();
  }

  const backendResponse = await callBackendAuthEndpoint(
    request,
    "/auth/refresh-token",
    {
      body: JSON.stringify({ refreshToken }),
      headers: getForwardedAuthHeaders(request),
      method: "POST",
    },
  );

  if (!backendResponse.ok) {
    return toEmptySessionResponse();
  }

  const tokens = (await backendResponse.json()) as SessionTokens;
  const response = NextResponse.json(
    { accessToken: tokens.accessToken } satisfies SessionTokens,
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

  applySessionCookies(response, request, tokens);

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
