import {
  decodeAccessTokenPayload,
  extractAuthUserFromToken,
} from "@/features/auth/application/services/auth-session";

export const decodeJwt = decodeAccessTokenPayload;
export const extractUserFromToken = extractAuthUserFromToken;
