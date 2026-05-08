"use client";

import { Link } from "@/i18n/routing";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, Camera, Loader2, Search, ShieldCheck } from "lucide-react";
import type { OrderDTO, OrderStatus } from "@/features/orders/domain/types/order.types";
import { resolveOrderByTrackingCodeUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import { useCreateTrackingEvent } from "@/features/tracking/presentation/hooks/useCreateTrackingEvent";
import { normalizeApiError } from "@/lib/api/errors";
import { useI18nCopy } from "@/i18n/useCopy";

type ScannerTab = "inbound" | "outbound";
type ScannerStatus =
  | "idle"
  | "requesting-permission"
  | "scanning"
  | "resolved"
  | "submitting"
  | "error";

type DetectedBarcode = {
  rawValue?: string | null;
};

type BarcodeDetectorInstance = {
  detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>;
};

type BarcodeDetectorConstructor = {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
  getSupportedFormats?: () => Promise<string[]>;
};

const DESIRED_BARCODE_FORMATS = [
  "aztec",
  "code_128",
  "code_39",
  "data_matrix",
  "ean_13",
  "ean_8",
  "itf",
  "pdf417",
  "qr_code",
  "upc_a",
  "upc_e",
] as const;

function getBarcodeDetectorConstructor() {
  return (
    globalThis as typeof globalThis & {
      BarcodeDetector?: BarcodeDetectorConstructor;
    }
  ).BarcodeDetector;
}

function normalizeTrackingCode(value: string) {
  return value.trim();
}

function getDefaultDescription(tab: ScannerTab) {
  return tab === "inbound"
    ? "Kiện hàng đã nhập kho"
    : "Kiện hàng rời kho để giao";
}

function getNextStatus(tab: ScannerTab): OrderStatus {
  return tab === "inbound" ? "ARRIVED_AT_HUB" : "OUT_FOR_DELIVERY";
}

function getStatusTone(status: OrderStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "ARRIVED_AT_HUB":
      return "bg-amber-100 text-amber-800";
    case "OUT_FOR_DELIVERY":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function WarehouseScannerPage() {
  const { getTrackingStatusLabel } = useI18nCopy();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ScannerTab>("inbound");
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus>("idle");
  const [trackingCodeInput, setTrackingCodeInput] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resolvedOrder, setResolvedOrder] = useState<OrderDTO | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isResolvingCode, setIsResolvingCode] = useState(false);
  const mutation = useCreateTrackingEvent();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetectorInstance | null>(null);
  const frameRequestRef = useRef<number | null>(null);
  const scannerStatusRef = useRef<ScannerStatus>("idle");
  const isResolvingRef = useRef(false);
  const lastDetectedCodeRef = useRef("");

  useEffect(() => {
    scannerStatusRef.current = scannerStatus;
  }, [scannerStatus]);

  useEffect(() => {
    const hasCameraApi =
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      Boolean(getBarcodeDetectorConstructor());
    setCameraReady(hasCameraApi);
  }, []);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "outbound" || mode === "inbound") {
      setActiveTab(mode);
      if (resolvedOrder) {
        setDescription(getDefaultDescription(mode));
      }
    }
  }, [resolvedOrder, searchParams]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  function stopCameraStream() {
    if (frameRequestRef.current !== null) {
      window.cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = null;
    }

    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    detectorRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function resetResolvedOrder() {
    setResolvedOrder(null);
    setDescription("");
    setTrackingCodeInput("");
    lastDetectedCodeRef.current = "";
  }

  async function resolveTrackingCode(rawValue: string) {
    const normalizedTrackingCode = normalizeTrackingCode(rawValue);

    setSuccessMessage("");
    setErrorMessage("");
    mutation.reset();

    if (!normalizedTrackingCode) {
      setResolvedOrder(null);
      setScannerStatus("error");
      setErrorMessage("Hãy nhập hoặc quét mã theo dõi hợp lệ.");
      return;
    }

    setTrackingCodeInput(normalizedTrackingCode);
    setIsResolvingCode(true);
    isResolvingRef.current = true;

    try {
      const order = await resolveOrderByTrackingCodeUseCase(normalizedTrackingCode);
      setResolvedOrder(order);
      setDescription(getDefaultDescription(activeTab));
      setScannerStatus("resolved");
    } catch (error) {
      setResolvedOrder(null);
      setScannerStatus("error");
      setErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsResolvingCode(false);
      isResolvingRef.current = false;
    }
  }

  function scheduleDetectLoop() {
    frameRequestRef.current = window.requestAnimationFrame(async () => {
      if (scannerStatusRef.current !== "scanning") {
        return;
      }

      const detector = detectorRef.current;
      const video = videoRef.current;

      if (
        !detector ||
        !video ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        scheduleDetectLoop();
        return;
      }

      try {
        const detectedCodes = await detector.detect(video);
        const matchedCode = detectedCodes
          .map((item) => normalizeTrackingCode(String(item.rawValue ?? "")))
          .find((item) => item.length > 0);

        if (
          matchedCode &&
          !isResolvingRef.current &&
          matchedCode !== lastDetectedCodeRef.current
        ) {
          lastDetectedCodeRef.current = matchedCode;
          stopCameraStream();
          void resolveTrackingCode(matchedCode);
          return;
        }
      } catch {
        // Silent retry for transient camera frames.
      }

      scheduleDetectLoop();
    });
  }

  async function startCameraScanner() {
    setSuccessMessage("");
    setErrorMessage("");
    resetResolvedOrder();
    mutation.reset();

    const BarcodeDetectorApi = getBarcodeDetectorConstructor();
    if (!BarcodeDetectorApi || !navigator.mediaDevices?.getUserMedia) {
      setScannerStatus("error");
      setErrorMessage(
        "Thiết bị này không hỗ trợ quét camera. Hãy dùng ô nhập mã hoặc máy quét USB.",
      );
      return;
    }

    setScannerStatus("requesting-permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      const supportedFormats = BarcodeDetectorApi.getSupportedFormats
        ? await BarcodeDetectorApi.getSupportedFormats()
        : [];
      const selectedFormats = supportedFormats.filter((format) =>
        DESIRED_BARCODE_FORMATS.includes(format as (typeof DESIRED_BARCODE_FORMATS)[number]),
      );

      detectorRef.current = new BarcodeDetectorApi(
        selectedFormats.length > 0 ? { formats: selectedFormats } : undefined,
      );

      setScannerStatus("scanning");
      scheduleDetectLoop();
    } catch (error) {
      stopCameraStream();
      setScannerStatus("error");

      const normalizedError = error instanceof DOMException ? error.name : "";
      if (normalizedError === "NotAllowedError") {
        setErrorMessage(
          "Bạn đã từ chối quyền camera. Hãy cấp quyền rồi thử lại, hoặc dùng máy quét USB.",
        );
        return;
      }

      if (normalizedError === "NotFoundError") {
        setErrorMessage(
          "Không tìm thấy camera khả dụng trên thiết bị này. Hãy dùng ô nhập mã.",
        );
        return;
      }

      setErrorMessage("Không thể khởi động camera lúc này. Hãy thử lại hoặc nhập mã thủ công.");
    }
  }

  async function handleConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!resolvedOrder) {
      setScannerStatus("error");
      setErrorMessage("Chưa có đơn hàng nào được xác nhận từ mã quét.");
      return;
    }

    setScannerStatus("submitting");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await mutation.mutateAsync({
        description: description.trim() || getDefaultDescription(activeTab),
        eventType: "STATUS_CHANGE",
        orderId: Number(resolvedOrder.id),
        source: "HUB_SCANNER",
        status: getNextStatus(activeTab),
      });

      const trackingLabel =
        resolvedOrder.trackingCode ?? resolvedOrder.reference ?? `ORD-${resolvedOrder.id}`;

      resetResolvedOrder();
      setScannerStatus("idle");
      setSuccessMessage(`Đã cập nhật ${trackingLabel} thành công.`);
    } catch (error) {
      setScannerStatus("error");
      setErrorMessage(normalizeApiError(error).message);
    }
  }

  async function handleTrackingLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    stopCameraStream();
    void resolveTrackingCode(trackingCodeInput);
  }

  const isCameraBusy =
    scannerStatus === "requesting-permission" || scannerStatus === "scanning";
  const isScannerBusy =
    isCameraBusy || isResolvingCode || scannerStatus === "submitting";
  const resolvedTrackingLabel =
    resolvedOrder?.trackingCode ??
    resolvedOrder?.reference ??
    (resolvedOrder ? `ORD-${resolvedOrder.id}` : "");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] flex-col bg-[#F0FDF4] py-5 md:py-7">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <div className="mb-6 pt-4 text-center">
          <h1 className="text-[28px] font-bold text-emerald-900">Trạm Quét Mã Kho</h1>
          <p className="mt-1 text-[14px] text-slate-600">Trung tâm phân phối miền Nam</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/warehouse/notifications"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Bell className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Thông báo</p>
                <p className="text-xs text-slate-600">Mở hộp thông báo phê duyệt và vận hành</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-700">Mở</span>
          </Link>

          <Link
            href="/warehouse/roles"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Yêu cầu vai trò</p>
                <p className="text-xs text-slate-600">Đăng ký và theo dõi yêu cầu vai trò</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-700">Mở</span>
          </Link>
        </div>

        <div className="mb-8 flex gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-2.5 shadow-sm">
          <button
            className={`flex-1 rounded-xl py-3.5 text-center text-[16px] font-bold transition-all ${
              activeTab === "inbound"
                ? "bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-200"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
            }`}
            onClick={() => {
              setActiveTab("inbound");
              if (resolvedOrder) {
                setDescription(getDefaultDescription("inbound"));
              }
            }}
            type="button"
          >
            Nhập kho
          </button>
          <button
            className={`flex-1 rounded-xl py-3.5 text-center text-[16px] font-bold transition-all ${
              activeTab === "outbound"
                ? "bg-white text-blue-800 shadow-sm ring-1 ring-blue-200"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
            }`}
            onClick={() => {
              setActiveTab("outbound");
              if (resolvedOrder) {
                setDescription(getDefaultDescription("outbound"));
              }
            }}
            type="button"
          >
            Xuất kho
          </button>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => void startCameraScanner()}
              disabled={isScannerBusy}
              className="group flex w-full flex-col items-center rounded-2xl border border-dashed border-emerald-200 bg-[#F0FDF4] p-5 text-center transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-80"
            >
              <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-slate-950 md:h-72">
                {scannerStatus === "scanning" ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="pointer-events-none absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.95)]" />
                    <div className="pointer-events-none absolute inset-5 rounded-xl border border-emerald-300/70" />
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 px-6 text-white">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                      {scannerStatus === "requesting-permission" ? (
                        <Loader2 className="size-8 animate-spin" />
                      ) : (
                        <Camera className="size-8" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold">
                        {scannerStatus === "requesting-permission"
                          ? "Đang xin quyền camera"
                          : "Chạm để mở camera quét mã"}
                      </p>
                      <p className="text-sm text-emerald-100/85">
                        Ưu tiên camera sau, đọc trực tiếp mã theo dõi trên kiện hàng.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-[15px] font-semibold text-emerald-900">
                  {scannerStatus === "scanning"
                    ? "Đang quét bằng camera"
                    : scannerStatus === "requesting-permission"
                      ? "Chuẩn bị camera"
                      : "Chạm vùng trên để bắt đầu quét"}
                </p>
                <p className="max-w-md text-[14px] leading-relaxed text-slate-600">
                  {cameraReady
                    ? "Nếu thiết bị không quét được bằng camera, hãy dùng máy quét USB hoặc nhập mã theo dõi ở biểu mẫu bên dưới."
                    : "Thiết bị hiện không hỗ trợ bộ quét mã của trình duyệt. Luồng nhập tay và máy quét USB vẫn hoạt động bình thường."}
                </p>
              </div>
            </button>

            {scannerStatus === "scanning" ? (
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setScannerStatus("idle");
                }}
                className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Dừng camera
              </button>
            ) : null}

            <form
              onSubmit={(event) => void handleTrackingLookup(event)}
              className="mt-6 space-y-4"
            >
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Mã theo dõi / máy quét USB
                </span>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Quét hoặc nhập mã theo dõi..."
                      className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-[15px] font-mono text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      onChange={(event) => setTrackingCodeInput(event.target.value)}
                      value={trackingCodeInput}
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-12 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isScannerBusy}
                  >
                    {isResolvingCode ? "Đang tra cứu..." : "Tra cứu mã"}
                  </button>
                </div>
              </label>
            </form>

            {errorMessage ? (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            ) : null}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-emerald-900">Xác nhận kiện hàng</h2>
              <p className="mt-1 text-sm text-slate-600">
                Kiểm tra đơn hàng vừa quét trước khi cập nhật trạng thái vận hành.
              </p>
            </div>

            {resolvedOrder ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Mã theo dõi
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {resolvedTrackingLabel}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusTone(
                        resolvedOrder.status,
                      )}`}
                    >
                      {getTrackingStatusLabel(resolvedOrder.status)}
                    </span>
                  </div>

                  <dl className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Người gửi
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {resolvedOrder.customerName}
                      </dd>
                      <dd>{resolvedOrder.pickupAddress}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Người nhận
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {resolvedOrder.receiverName ?? "Đang cập nhật"}
                      </dd>
                      <dd>{resolvedOrder.deliveryAddress}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Khối lượng
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {resolvedOrder.packageWeightKg
                          ? `${resolvedOrder.packageWeightKg} kg`
                          : "Đang cập nhật"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Trung tâm hiện tại
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {resolvedOrder.currentHubId ?? "Chưa gán"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <form
                  onSubmit={(event) => void handleConfirm(event)}
                  className="space-y-4"
                >
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Mô tả lượt cập nhật
                    </span>
                    <textarea
                      className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder={getDefaultDescription(activeTab)}
                      value={description}
                    />
                  </label>

                  <button
                    type="submit"
                    className={`h-12 w-full rounded-lg text-[15px] font-bold text-white shadow-sm transition-colors ${
                      activeTab === "inbound"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={scannerStatus === "submitting"}
                  >
                    {scannerStatus === "submitting"
                      ? "Đang cập nhật..."
                      : `Xác nhận ${activeTab === "inbound" ? "nhập kho" : "xuất kho"}`}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Camera className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Chưa có kiện hàng nào được chọn
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                  Quét camera hoặc dùng máy quét USB để lấy mã theo dõi, hệ thống sẽ
                  tra cứu đơn rồi hiển thị khối xác nhận tại đây.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
