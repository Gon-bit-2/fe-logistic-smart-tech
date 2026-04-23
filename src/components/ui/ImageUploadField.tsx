"use client";

import { type ChangeEvent, type DragEvent, useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, X, Upload } from "lucide-react";

export interface ImageUploadFieldProps {
  /** URL ảnh hiện tại (khi đang ở chế độ sửa) */
  readonly currentImageUrl?: string | null;
  /** Callback khi upload thành công, trả về URL ảnh */
  readonly onImageUploaded: (url: string) => void;
  /** Callback khi xóa ảnh */
  readonly onImageRemoved?: () => void;
  /** Function thực hiện upload file, trả về URL */
  readonly uploadFn: (file: File) => Promise<{ url: string }>;
  /** Đang upload hay không */
  readonly isUploading?: boolean;
  /** Label hiển thị */
  readonly label?: string;
  /** Placeholder text */
  readonly placeholder?: string;
}

/**
 * Component upload ảnh đại diện với drag-and-drop
 * Hỗ trợ: kéo-thả file, chọn file, preview ảnh, xóa ảnh
 * Design: glassmorphism border, gradient overlay, micro-animations
 */
export default function ImageUploadField({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  uploadFn,
  isUploading = false,
  label = "Ảnh đại diện",
  placeholder = "Kéo thả ảnh vào đây hoặc nhấn để chọn",
}: Readonly<ImageUploadFieldProps>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // URL hiển thị: ưu tiên preview (ảnh mới chọn) > currentImageUrl (ảnh đã có)
  const displayUrl = previewUrl ?? currentImageUrl ?? null;

  /** Xử lý file được chọn hoặc thả vào */
  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Chỉ chấp nhận file ảnh (JPG, PNG, WebP, ...)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Dung lượng ảnh tối đa 5MB");
        return;
      }

      setUploadError(null);

      // Tạo preview URL trước khi upload
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        const result = await uploadFn(file);
        onImageUploaded(result.url);
        // Thay preview bằng URL thật từ Cloudinary
        setPreviewUrl(result.url);
      } catch {
        setUploadError("Upload ảnh thất bại. Vui lòng thử lại.");
        setPreviewUrl(null);
      }
    },
    [uploadFn, onImageUploaded],
  );

  /** Xử lý chọn file từ input */
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
    // Reset input để cho phép chọn lại cùng file
    event.target.value = "";
  }

  /** Xử lý kéo file vào vùng drop */
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }

  /** Xử lý thả file vào vùng drop */
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      void handleFile(file);
    }
  }

  /** Xóa ảnh đã upload */
  function handleRemoveImage() {
    setPreviewUrl(null);
    setUploadError(null);
    onImageRemoved?.();
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
        {label}
      </span>

      {/* Drop zone hoặc preview */}
      {displayUrl ? (
        /* === Chế độ hiển thị ảnh đã có === */
        <div className="group relative overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
          <img
            src={displayUrl}
            alt={label}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay gradient khi hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Nút xóa ảnh */}
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-destructive group-hover:opacity-100"
            title="Xóa ảnh"
          >
            <X className="size-4" />
          </button>

          {/* Nút đổi ảnh */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 group-hover:opacity-100"
          >
            <Upload className="size-3.5" />
            Đổi ảnh
          </button>

          {/* Loading overlay */}
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 backdrop-blur-md">
                <Loader2 className="size-5 animate-spin text-white" />
                <span className="text-sm font-bold text-white">Đang tải...</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* === Chế độ Drop Zone (chưa có ảnh) === */
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all duration-300",
            isDragOver
              ? "border-primary bg-primary/5 shadow-[0_0_24px_-6px_rgba(16,185,129,0.2)]"
              : "border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40 hover:bg-primary/[0.02]",
            isUploading ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-10 animate-spin text-primary/60" />
              <span className="text-sm font-semibold text-on-surface/50">
                Đang tải ảnh lên...
              </span>
            </>
          ) : (
            <>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/8">
                <ImagePlus className="size-7 text-primary/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-on-surface/55">
                  {placeholder}
                </p>
                <p className="mt-1 text-xs text-on-surface/35">
                  JPG, PNG, WebP — tối đa 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {uploadError ? (
        <p className="text-xs font-medium text-destructive">{uploadError}</p>
      ) : null}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
