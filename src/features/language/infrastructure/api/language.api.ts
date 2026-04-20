import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type { LanguageDto } from "@/features/language/domain/types/language.types";
import { API_LANGUAGE, API_LANGUAGE_DETAIL } from "@/utils/apiUrl";

export async function listLanguagesRequest() {
  const response = await httpClient.get<PaginatedResult<LanguageDto>>(API_LANGUAGE, {
    params: {
      limit: 100,
      page: 1,
    },
  });
  return response.data;
}

export async function createLanguageRequest(payload: LanguageDto) {
  const response = await httpClient.post<LanguageDto>(API_LANGUAGE, payload);
  return response.data;
}

export async function updateLanguageRequest(languageId: string, payload: LanguageDto) {
  const response = await httpClient.put<LanguageDto>(
    API_LANGUAGE_DETAIL(languageId),
    payload,
  );
  return response.data;
}

export async function deleteLanguageRequest(languageId: string) {
  const response = await httpClient.delete<{ message: string }>(
    API_LANGUAGE_DETAIL(languageId),
  );
  return response.data;
}
