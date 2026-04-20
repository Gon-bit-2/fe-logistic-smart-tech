import { httpClient } from "@/lib/api/http-client";
import {
  API_UPLOAD_MULTIPLE_POD,
  API_UPLOAD_POD,
} from "@/utils/apiUrl";
import {
  createMultipartArrayFormData,
  createMultipartFormData,
} from "@/lib/api/multipart";

export type PodUploadResult = {
  type?: string;
  url: string;
};

export async function uploadPodImageRequest(file: File) {
  const response = await httpClient.post<PodUploadResult>(
    API_UPLOAD_POD,
    createMultipartFormData({ file }),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function uploadMultiplePodImagesRequest(files: ReadonlyArray<File>) {
  const response = await httpClient.post<PodUploadResult[]>(
    API_UPLOAD_MULTIPLE_POD,
    createMultipartArrayFormData("files", [...files]),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
