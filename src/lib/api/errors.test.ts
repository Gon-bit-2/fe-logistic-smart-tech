import { describe, it, expect } from "vitest";
import { ApiError, isApiError, normalizeApiError } from "./errors";
import axios, { AxiosError, AxiosHeaders } from "axios";

describe("errors utility", () => {
  describe("ApiError class", () => {
    it("should instantiate correctly with minimum params", () => {
      const error = new ApiError({ message: "Test error" });
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("ApiError");
      expect(error.code).toBeNull();
      expect(error.status).toBeNull();
    });

    it("should instantiate correctly with all params", () => {
      const error = new ApiError({
        message: "Full error",
        code: "ERR_CUSTOM",
        status: 400,
        details: { foo: "bar" },
        issues: [{ message: "Invalid foo", path: "foo" }],
      });
      expect(error.message).toBe("Full error");
      expect(error.code).toBe("ERR_CUSTOM");
      expect(error.status).toBe(400);
      expect(error.details).toEqual({ foo: "bar" });
      expect(error.issues).toHaveLength(1);
    });
  });

  describe("isApiError", () => {
    it("should return true for ApiError instances", () => {
      const error = new ApiError({ message: "Test" });
      expect(isApiError(error)).toBe(true);
    });

    it("should return false for other errors", () => {
      expect(isApiError(new Error("Test"))).toBe(false);
      expect(isApiError({})).toBe(false);
      expect(isApiError(null)).toBe(false);
    });
  });

  describe("normalizeApiError", () => {
    it("should return the same error if it is already an ApiError", () => {
      const error = new ApiError({ message: "Test" });
      expect(normalizeApiError(error)).toBe(error);
    });

    it("should normalize a generic Error", () => {
      const error = new Error("Generic failure");
      const normalized = normalizeApiError(error);
      expect(normalized).toBeInstanceOf(ApiError);
      expect(normalized.message).toBe("Generic failure");
    });

    it("should normalize unknown throwables", () => {
      const normalized = normalizeApiError("String error");
      expect(normalized).toBeInstanceOf(ApiError);
      expect(normalized.message).toBe("Request failed");
    });

    describe("Axios errors", () => {
      it("should handle ERR_NETWORK", () => {
        const error = new AxiosError("Network Error", "ERR_NETWORK");
        const normalized = normalizeApiError(error);
        expect(normalized.message).toBe("Network request failed");
        expect(normalized.code).toBe("ERR_NETWORK");
      });

      it("should handle 401 Unauthorized", () => {
        const error = new AxiosError("Request failed with status code 401", "ERR_BAD_REQUEST", undefined, undefined, {
          status: 401,
          data: undefined,
          statusText: "Unauthorized",
          headers: {},
          config: { headers: new AxiosHeaders() },
        });
        const normalized = normalizeApiError(error);
        expect(normalized.status).toBe(401);
        expect(normalized.message).toBe("Your session has expired. Please log in again.");
      });

      it("should extract nested message from response data", () => {
        const error = new AxiosError("Bad Request", "ERR_BAD_REQUEST", undefined, undefined, {
          status: 400,
          data: {
            message: "Custom validation error from backend",
          },
          statusText: "Bad Request",
          headers: {},
          config: { headers: new AxiosHeaders() },
        });
        const normalized = normalizeApiError(error);
        expect(normalized.message).toBe("Custom validation error from backend");
        expect(normalized.status).toBe(400);
      });

      it("should replace machine permission codes with a readable fallback", () => {
        const error = new AxiosError("Forbidden", "ERR_BAD_REQUEST", undefined, undefined, {
          status: 403,
          data: {
            message: "Error.Forbidden",
          },
          statusText: "Forbidden",
          headers: {},
          config: { headers: new AxiosHeaders() },
        });
        const normalized = normalizeApiError(error);
        expect(normalized.status).toBe(403);
        expect(normalized.message).toBe(
          "You do not have permission to perform this action.",
        );
      });

      it("should extract array of issues from response data", () => {
        const error = new AxiosError("Bad Request", "ERR_BAD_REQUEST", undefined, undefined, {
          status: 422,
          data: {
            message: [
              { message: "Invalid email", path: "email" },
              { message: "Password too short", path: "password" },
            ],
          },
          statusText: "Unprocessable Entity",
          headers: {},
          config: { headers: new AxiosHeaders() },
        });
        const normalized = normalizeApiError(error);
        expect(normalized.message).toBe("Invalid email, Password too short");
        expect(normalized.issues).toHaveLength(2);
        expect(normalized.issues?.[0].path).toBe("email");
      });
    });
  });
});
