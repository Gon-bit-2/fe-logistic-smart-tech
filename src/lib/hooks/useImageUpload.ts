import { useMutation } from "@tanstack/react-query";
import {
  uploadImageRequest,
  type ImageUploadResult,
} from "@/lib/api/image-upload.api";

/**
 * Hook upload ảnh lên Cloudinary
 * Cung cấp mutation state: isUploading, error, uploadedUrl
 * @param folder - Thư mục Cloudinary (logistic_vehicles, logistic_hubs, etc.)
 */
export function useImageUpload(folder?: string) {
  const mutation = useMutation<ImageUploadResult, Error, File>({
    mutationFn: (file: File) => uploadImageRequest(file, folder),
  });

  return {
    /** Trigger upload ảnh */
    upload: mutation.mutateAsync,
    /** Đang upload hay không */
    isUploading: mutation.isPending,
    /** URL ảnh đã upload (hoặc null nếu chưa upload) */
    uploadedUrl: mutation.data?.url ?? null,
    /** Lỗi khi upload (nếu có) */
    error: mutation.error,
    /** Reset trạng thái upload */
    reset: mutation.reset,
  };
}
