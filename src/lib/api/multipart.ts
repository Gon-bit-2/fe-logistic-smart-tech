export function createMultipartFormData(
  fields: Record<string, string | Blob | File | null | undefined>,
) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    formData.append(key, value);
  });

  return formData;
}

export function createMultipartArrayFormData(
  key: string,
  files: ReadonlyArray<File>,
) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append(key, file);
  });

  return formData;
}
