import { NextResponse, type NextRequest } from "next/server";
import {
  applySessionCookies,
  callBackendAuthEndpoint,
  clearSessionCookies,
  getForwardedAuthHeaders,
} from "@/lib/api/server-session";
import { resolveTrustedSession } from "@/lib/api/trusted-session";
import type { SessionBootstrapPayload, SessionTokens } from "@/types/common.type";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await callBackendAuthEndpoint(request, "/auth/google/session", {
    body: JSON.stringify(body),
    headers: getForwardedAuthHeaders(request),
    method: "POST",
  });

  const responsePayload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(responsePayload, {
      headers: {
        "Cache-Control": "no-store",
      },
      status: backendResponse.status,
    });
  }

  const tokens = responsePayload as SessionTokens;
  const session = await resolveTrustedSession({
    accessToken: tokens.accessToken,
    forwardedHeaders: getForwardedAuthHeaders(request),
    refreshToken: tokens.refreshToken,
  });

  if (!session) {
    const response = NextResponse.json(
      { message: "Authenticated session could not be established." },
      {
        headers: {
          "Cache-Control": "no-store",
        },
        status: 502,
      },
    );

    clearSessionCookies(response);
    return response;
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

  applySessionCookies(response, request, tokens);

  return response;
}
