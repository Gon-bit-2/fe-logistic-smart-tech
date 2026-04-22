import { afterEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("prefers NEXT_PUBLIC_API_BASE_URL when present", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8386");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:9999");

    const env = await import("./env");

    expect(env.API_BASE_URL).toBe("http://localhost:8386");
    expect(env.hasApiBaseUrl).toBe(true);
  });

  it("strips wrapping quotes from public env values", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "'http://localhost:8386'");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    const env = await import("./env");

    expect(env.API_BASE_URL).toBe("http://localhost:8386");
    expect(env.normalizePublicEnvValue("\"pk_test_123\"")).toBe("pk_test_123");
  });

  it("falls back to NEXT_PUBLIC_API_URL and reports missing configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    const env = await import("./env");

    expect(env.API_BASE_URL).toBe("");
    expect(env.hasApiBaseUrl).toBe(false);
  });
});
