import type { SessionTokens } from "@/types/common.type";

const ACCESS_TOKEN_KEY = "emerald-logistics.access-token";
const REFRESH_TOKEN_KEY = "emerald-logistics.refresh-token";

function isBrowser() {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  getAccessToken() {
    if (!isBrowser()) {
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    if (!isBrowser()) {
      return null;
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getTokens(): SessionTokens | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
    };
  },

  setTokens(tokens: SessionTokens) {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  clear() {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
