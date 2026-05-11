import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAuthSession,
  clearOtpFlowState,
  getAuthSessionSnapshot,
  initializeAuthStore,
  setAuthSession,
  setPendingPasswordReset,
  setPendingRegistration,
} from "./auth.store";
import { restoreSession } from "@/lib/api/session-client";

vi.mock("@/lib/api/session-client", () => ({
  restoreSession: vi.fn(),
}));

const trustedProfile = {
  avatarUrl: null,
  email: "customer@emerald.com",
  fullName: "Customer",
  hubId: null,
  id: 1,
  initials: "CU",
  phone: null,
  role: "customer" as const,
  roleId: 2,
};

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
        profile: trustedProfile,
      });

      await initializeAuthStore();

      const snapshot = getAuthSessionSnapshot();
      expect(snapshot.isHydrated).toBe(true);
      expect(snapshot.status).toBe("authenticated");
      expect(snapshot.accessToken).toContain("header.");
      expect(snapshot.isAuthenticated).toBe(true);
      expect(snapshot.user).toEqual({
        hubId: null,
        id: 1,
        role: "customer",
        roleId: 2,
      });
    });
  });

  describe("setAuthSession", () => {
    it("updates in-memory auth state", () => {
      setAuthSession({
        accessToken: "header.eyJ1c2VySWQiOjEsInJvbGVJZCI6MiwiZXhwIjo0MTAyNDQ0ODAwLCJyb2xlTmFtZSI6IkNVU1RPTUVSIn0.signature",
        profile: trustedProfile,
      });

      const snapshot = getAuthSessionSnapshot();
      expect(snapshot.status).toBe("authenticated");
      expect(snapshot.isAuthenticated).toBe(true);
      expect(snapshot.accessToken).toContain("header.");
      expect(snapshot.user?.role).toBe("customer");
    });
  });

  describe("clearAuthSession", () => {
    it("resets the auth state", () => {
      setAuthSession({
        accessToken: "header.eyJ1c2VySWQiOjEsInJvbGVJZCI6MiwiZXhwIjo0MTAyNDQ0ODAwLCJyb2xlTmFtZSI6IkNVU1RPTUVSIn0.signature",
        profile: trustedProfile,
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
