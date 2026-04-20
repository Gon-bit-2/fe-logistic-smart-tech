import { hasApiBaseUrl } from "@/lib/api/env";
import { ApiError } from "@/lib/api/errors";
import type { LanguageDto } from "@/features/language/domain/types/language.types";
import {
  createLanguageRequest,
  deleteLanguageRequest,
  listLanguagesRequest,
  updateLanguageRequest,
} from "@/features/language/infrastructure/api/language.api";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message: "Language API chưa được cấu hình.",
      status: 503,
    });
  }
}

export async function listLanguagesUseCase() {
  assertApiConfigured();
  return listLanguagesRequest();
}

export async function createLanguageUseCase(payload: LanguageDto) {
  assertApiConfigured();
  return createLanguageRequest(payload);
}

export async function updateLanguageUseCase(languageId: string, payload: LanguageDto) {
  assertApiConfigured();
  return updateLanguageRequest(languageId, payload);
}

export async function deleteLanguageUseCase(languageId: string) {
  assertApiConfigured();
  return deleteLanguageRequest(languageId);
}
