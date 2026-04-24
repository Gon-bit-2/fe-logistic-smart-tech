"use client";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import WarehouseScannerPage from "./page";

const resolveOrderByTrackingCodeUseCaseMock = vi.fn();
const mutateAsyncMock = vi.fn();
const mutationResetMock = vi.fn();

vi.mock("@/features/orders/application/use-cases/order.use-cases", () => ({
  resolveOrderByTrackingCodeUseCase: (trackingCode: string) =>
    resolveOrderByTrackingCodeUseCaseMock(trackingCode),
}));

vi.mock("@/features/tracking/presentation/hooks/useCreateTrackingEvent", () => ({
  useCreateTrackingEvent: () => ({
    error: null,
    isPending: false,
    mutateAsync: mutateAsyncMock,
    reset: mutationResetMock,
  }),
}));

describe("WarehouseScannerPage", () => {
  beforeEach(() => {
    resolveOrderByTrackingCodeUseCaseMock.mockReset();
    mutateAsyncMock.mockReset();
    mutationResetMock.mockReset();

    (
      globalThis as typeof globalThis & {
        BarcodeDetector?: {
          getSupportedFormats?: () => Promise<string[]>;
          new (): { detect: () => Promise<Array<{ rawValue?: string | null }>> };
        };
      }
    ).BarcodeDetector = class {
      static async getSupportedFormats() {
        return ["qr_code", "code_128"];
      }

      async detect() {
        return [];
      }
    } as unknown as typeof globalThis.BarcodeDetector;

    Object.defineProperty(globalThis.navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn(),
      },
    });
  });

  it("resolves a tracking code manually and confirms inbound status change", async () => {
    resolveOrderByTrackingCodeUseCaseMock.mockResolvedValue({
      id: "42",
      reference: "GT-ORD-20260042",
      trackingCode: "GT-ORD-20260042",
      customerName: "Nguyen Van A",
      pickupAddress: "123 Nguyen Trai",
      deliveryAddress: "456 Le Loi",
      receiverName: "Tran Thi B",
      status: "IN_TRANSIT",
      packageWeightKg: 12,
      currentHubId: 5,
      estimatedArrival: new Date().toISOString(),
      stops: [],
    });
    mutateAsyncMock.mockResolvedValue({
      id: 100,
      status: "ARRIVED_AT_HUB",
    });

    renderWithProviders(<WarehouseScannerPage />);

    const trackingInput = screen.getByPlaceholderText("Quét hoặc nhập mã theo dõi...");

    fireEvent.change(trackingInput, {
      target: { value: "GT-ORD-20260042" },
    });
    fireEvent.submit(trackingInput.closest("form")!);

    await screen.findByText("GT-ORD-20260042");
    fireEvent.click(screen.getByRole("button", { name: "Xác nhận nhập kho" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        description: "Kiện hàng đã nhập kho",
        eventType: "STATUS_CHANGE",
        orderId: 42,
        source: "HUB_SCANNER",
        status: "ARRIVED_AT_HUB",
      });
    });

    expect(await screen.findByText("Đã cập nhật GT-ORD-20260042 thành công.")).toBeInTheDocument();
  });

  it("shows a permission error when camera access is denied", async () => {
    const getUserMediaMock = vi
      .fn()
      .mockRejectedValue(new DOMException("Permission denied", "NotAllowedError"));

    Object.defineProperty(globalThis.navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: getUserMediaMock,
      },
    });

    renderWithProviders(<WarehouseScannerPage />);

    fireEvent.click(screen.getByRole("button", { name: /Chạm vùng trên để bắt đầu quét/i }));

    expect(
      await screen.findByText(
        "Bạn đã từ chối quyền camera. Hãy cấp quyền rồi thử lại, hoặc dùng máy quét USB.",
      ),
    ).toBeInTheDocument();
  });
});
