import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { getLocalizedApiErrorMessage } from "@/i18n/localized-error";

function createTranslator(messages: Record<string, string>) {
  const t = ((key: string) => messages[key] ?? key) as ((key: string) => string) & {
    has: (key: string) => boolean;
  };
  t.has = (key: string) => Object.prototype.hasOwnProperty.call(messages, key);
  return t as never;
}

describe("getLocalizedApiErrorMessage", () => {
  it("prefers machine-readable error codes", () => {
    const t = createTranslator({
      "codes.Error.Language.Conflict": "Language already exists",
      fallback: "Fallback",
    });

    expect(
      getLocalizedApiErrorMessage(
        new ApiError({
          errorCode: "Error.Language.Conflict",
          message: "Ngôn ngữ đã tồn tại",
          status: 409,
        }),
        t,
      ),
    ).toBe("Language already exists");
  });

  it("falls back to localized status messages", () => {
    const t = createTranslator({
      fallback: "Fallback",
      "status.404": "Missing resource",
    });

    expect(
      getLocalizedApiErrorMessage(
        new ApiError({
          message: "Không tìm thấy",
          status: 404,
        }),
        t,
      ),
    ).toBe("Missing resource");
  });
});
