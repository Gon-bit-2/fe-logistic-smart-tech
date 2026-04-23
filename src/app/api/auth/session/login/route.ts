import { NextResponse, type NextRequest } from "next/server";
import {
  applySessionCookies,
  callBackendAuthEndpoint,
  getForwardedAuthHeaders,
} from "@/lib/api/server-session";
import type { SessionTokens } from "@/types/common.type";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await callBackendAuthEndpoint(request, "/auth/login", {
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
