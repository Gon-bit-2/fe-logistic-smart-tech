import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL, normalizePublicEnvValue } from "@/lib/api/env";
import type { SessionTokens } from "@/types/common.type";

export const ACCESS_TOKEN_COOKIE_KEY = "emerald-logistics.access-token";
export const REFRESH_TOKEN_COOKIE_KEY = "emerald-logistics.refresh-token";

type JwtPayload = {
  exp?: number;
};

function getBackendBaseUrl() {
  const baseUrl = normalizePublicEnvValue(API_BASE_URL);

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required for auth session routes.");
  }

  return baseUrl;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const encodedPayload = token.split(".")[1];

    if (!encodedPayload) {
      return null;
    }

    const payload = Buffer.from(
      encodedPayload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf-8");

    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, clockSkewSeconds = 0) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  const currentEpoch = Math.floor(Date.now() / 1000);
  return payload.exp <= currentEpoch + clockSkewSeconds;
}

function getTokenMaxAgeSeconds(token: string, fallbackSeconds: number) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return fallbackSeconds;
  }

  const currentEpoch = Math.floor(Date.now() / 1000);
  return Math.max(payload.exp - currentEpoch, 0);
}

function isSecureRequest(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  return request.headers.get("x-forwarded-proto") === "https";
}

export function applySessionCookies(
  response: NextResponse,
  request: NextRequest,
  tokens: SessionTokens,
) {
  const secure = isSecureRequest(request);

  response.cookies.set({
    httpOnly: true,
    maxAge: getTokenMaxAgeSeconds(tokens.accessToken, 15 * 60),
    name: ACCESS_TOKEN_COOKIE_KEY,
    path: "/",
    sameSite: "lax",
    secure,
    value: tokens.accessToken,
  });

  if (tokens.refreshToken) {
    response.cookies.set({
      httpOnly: true,
      maxAge: getTokenMaxAgeSeconds(tokens.refreshToken, 7 * 24 * 60 * 60),
      name: REFRESH_TOKEN_COOKIE_KEY,
      path: "/",
      sameSite: "lax",
      secure,
      value: tokens.refreshToken,
    });
  }
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set({
    httpOnly: true,
    maxAge: 0,
    name: ACCESS_TOKEN_COOKIE_KEY,
    path: "/",
    sameSite: "lax",
    value: "",
  });
  response.cookies.set({
    httpOnly: true,
    maxAge: 0,
    name: REFRESH_TOKEN_COOKIE_KEY,
    path: "/",
    sameSite: "lax",
    value: "",
  });
}

export function getForwardedAuthHeaders(request: NextRequest) {
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  const userAgent = request.headers.get("user-agent");
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (userAgent) {
    headers.set("user-agent", userAgent);
  }

  if (forwardedFor) {
    headers.set("x-forwarded-for", forwardedFor);
  }

  return headers;
}

export async function callBackendAuthEndpoint(
  request: NextRequest,
  pathname: string,
  init: RequestInit,
) {
  const endpoint = new URL(pathname, getBackendBaseUrl());

  return fetch(endpoint, {
    ...init,
    cache: "no-store",
    headers: init.headers ?? getForwardedAuthHeaders(request),
  });
}
