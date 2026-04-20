"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResult } from "@/types/common.type";
import type { LanguageDto } from "@/features/language/domain/types/language.types";
import {
  createLanguageUseCase,
  deleteLanguageUseCase,
  listLanguagesUseCase,
  updateLanguageUseCase,
} from "@/features/language/application/use-cases/language.use-cases";
import { ApiError } from "@/lib/api/errors";

const languageKeys = {
  all: ["language"] as const,
};

export function useLanguagesQuery() {
  return useQuery<PaginatedResult<LanguageDto>, ApiError>({
    queryFn: listLanguagesUseCase,
    queryKey: languageKeys.all,
  });
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();

  return useMutation<LanguageDto, ApiError, LanguageDto>({
    mutationFn: createLanguageUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation<LanguageDto, ApiError, LanguageDto>({
    mutationFn: (payload) => updateLanguageUseCase(payload.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: deleteLanguageUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: languageKeys.all });
    },
  });
}
