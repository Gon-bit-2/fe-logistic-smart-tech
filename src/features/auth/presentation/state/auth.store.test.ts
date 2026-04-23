import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAuthSession,
  clearOtpFlowState,
  getAuthSessionSnapshot,
  initializeAuthStore,
  setAuthSessionTokens,
  setPendingPasswordReset,
  setPendingRegistration,
} from "./auth.store";
import { restoreSession } from "@/lib/api/session-client";

vi.mock("@/lib/api/session-client", () => ({
  restoreSession: vi.fn(),
}));

describe("Auth Store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAuthSession();
  });

  describe("initializeAuthStore", () => {
    it("hydrates to anonymous state when no persisted session exists", async () => {
      vi.mocked(restoreSession).mockResolvedValue(null);

      await initializeAuthStore();

      const snapshot = getAuthSessionSnapshot();
      expect(snapshot.isHydrated).toBe(true);
      expect(snapshot.status).toBe("anonymous");
      expect(snapshot.accessToken).toBeNull();
      expect(snapshot.isAuthenticated).toBe(false);
    });

    it("hydrates to authenticated state when the server returns an access token", async () => {
      vi.mocked(restoreSession).mockResolvedValue({
        accessToken: "header.eyJ1c2VySWQiOjEsInJvbGVJZCI6MiwiZXhwIjo0MTAyNDQ0ODAwLCJyb2xlTmFtZSI6IkNVU1RPTUVSIn0.signature",
      });

      await initializeAuthStore();

      const snapshot = getAuthSessionSnapshot();
      expect(snapshot.isHydrated).toBe(true);
      expect(snapshot.status).toBe("authenticated");
      expect(snapshot.accessToken).toContain("header.");
      expect(snapshot.isAuthenticated).toBe(true);
    });
  });

  describe("setAuthSessionTokens", () => {
    it("updates in-memory auth state", () => {
      setAuthSessionTokens({
        accessToken: "header.eyJ1c2VySWQiOjEsInJvbGVJZCI6MiwiZXhwIjo0MTAyNDQ0ODAwLCJyb2xlTmFtZSI6IkNVU1RPTUVSIn0.signature",
      });

      const snapshot = getAuthSessionSnapshot();
      expect(snapshot.status).toBe("authenticated");
      expect(snapshot.isAuthenticated).toBe(true);
      expect(snapshot.accessToken).toContain("header.");
    });
  });

  describe("clearAuthSession", () => {
    it("resets the auth state", () => {
      setAuthSessionTokens({
        accessToken: "header.eyJ1c2VySWQiOjEsInJvbGVJZCI6MiwiZXhwIjo0MTAyNDQ0ODAwLCJyb2xlTmFtZSI6IkNVU1RPTUVSIn0.signature",
      });
      expect(getAuthSessionSnapshot().status).toBe("authenticated");

      clearAuthSession();

      const snapshot = getAuthSessionSnapshot();
      expect(snapshot.status).toBe("anonymous");
      expect(snapshot.accessToken).toBeNull();
    });
  });

  describe("OTP Flow State", () => {
    it("manages pending registration", () => {
      const draft = { email: "test@example.com", fullName: "Test", password: "123" };
      setPendingRegistration(draft);
      expect(getAuthSessionSnapshot().pendingRegistration).toEqual(draft);

      clearOtpFlowState();
      expect(getAuthSessionSnapshot().pendingRegistration).toBeNull();
    });

    it("manages pending password reset", () => {
      const draft = { email: "reset@example.com", password: "123", confirmPassword: "123" };
      setPendingPasswordReset(draft);
      expect(getAuthSessionSnapshot().pendingPasswordReset).toEqual(draft);

      clearOtpFlowState();
      expect(getAuthSessionSnapshot().pendingPasswordReset).toBeNull();
    });
  });
});
