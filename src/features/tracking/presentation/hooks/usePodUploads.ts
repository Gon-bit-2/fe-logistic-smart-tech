"use client";

import { useMutation } from "@tanstack/react-query";
import {
  uploadMultiplePodImagesUseCase,
  uploadPodImageUseCase,
} from "@/features/tracking/application/use-cases/tracking.use-cases";
import type { PodUploadResult } from "@/features/tracking/infrastructure/api/upload.api";
import { ApiError } from "@/lib/api/errors";

export function useUploadPodImage() {
  return useMutation<PodUploadResult, ApiError, File>({
    mutationFn: uploadPodImageUseCase,
  });
}

export function useUploadMultiplePodImages() {
  return useMutation<PodUploadResult[], ApiError, ReadonlyArray<File>>({
    mutationFn: uploadMultiplePodImagesUseCase,
  });
}
