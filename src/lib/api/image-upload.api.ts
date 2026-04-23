import { httpClient } from "@/lib/api/http-client";
import { API_UPLOAD_IMAGE } from "@/utils/apiUrl";
import { createMultipartFormData } from "@/lib/api/multipart";

/** Kết quả trả về sau khi upload ảnh lên Cloudinary */
export type ImageUploadResult = {
  url: string;
  public_id: string;
  format?: string;
  bytes?: number;
};

/**
 * Upload ảnh lên Cloudinary thông qua backend
 * @param file - File ảnh cần upload
 * @param folder - Thư mục phân loại trên Cloudinary (logistic_vehicles, logistic_hubs, etc.)
 * @returns URL ảnh đã upload
 */
export async function uploadImageRequest(
  file: File,
  folder?: string,
): Promise<ImageUploadResult> {
  const url = folder
    ? `${API_UPLOAD_IMAGE}?folder=${encodeURIComponent(folder)}`
    : API_UPLOAD_IMAGE;

  const response = await httpClient.post<ImageUploadResult>(
    url,
    createMultipartFormData({ file }),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
