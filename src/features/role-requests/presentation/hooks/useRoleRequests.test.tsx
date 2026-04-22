import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "@/test/render";
import { notificationKeys } from "@/features/notifications/presentation/state/notification.query-keys";
import { roleRequestKeys } from "@/features/role-requests/presentation/state/role-request.query-keys";
import {
  useApproveRoleRequest,
  useCreateRoleRequest,
  useRejectRoleRequest,
} from "./useRoleRequests";

const {
  approveRoleRequestUseCase,
  createRoleRequestUseCase,
  rejectRoleRequestUseCase,
} = vi.hoisted(() => ({
  approveRoleRequestUseCase: vi.fn(),
  createRoleRequestUseCase: vi.fn(),
  rejectRoleRequestUseCase: vi.fn(),
}));

vi.mock("@/features/role-requests/application/use-cases/role-request.use-cases", () => ({
  approveRoleRequestUseCase,
  createRoleRequestUseCase,
  listAdminRoleRequestsUseCase: vi.fn(),
  listMyRoleRequestsUseCase: vi.fn(),
  rejectRoleRequestUseCase,
}));

describe("useRoleRequests mutations", () => {
  beforeEach(() => {
    approveRoleRequestUseCase.mockReset();
    createRoleRequestUseCase.mockReset();
    rejectRoleRequestUseCase.mockReset();
  });

  it("invalidates role request and notification queries after create", async () => {
    createRoleRequestUseCase.mockResolvedValue({ id: "1" });

    const { result, queryClient } = renderHookWithProviders(() =>
      useCreateRoleRequest(),
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await act(async () => {
      await result.current.mutateAsync({
        reason: "Tôi muốn làm tài xế",
        targetRoleName: "DRIVER",
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: roleRequestKeys.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationKeys.all,
    });
  });

  it("invalidates dependencies after approve", async () => {
    approveRoleRequestUseCase.mockResolvedValue({ id: "2" });

    const { result, queryClient } = renderHookWithProviders(() =>
      useApproveRoleRequest(),
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await act(async () => {
      await result.current.mutateAsync({
        requestId: "2",
        payload: {
          hubId: 3,
          reviewNote: "Đủ điều kiện",
        },
      });
    });

    expect(approveRoleRequestUseCase).toHaveBeenCalledWith("2", {
      hubId: 3,
      reviewNote: "Đủ điều kiện",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: roleRequestKeys.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationKeys.all,
    });
  });

  it("invalidates dependencies after reject", async () => {
    rejectRoleRequestUseCase.mockResolvedValue({ id: "3" });

    const { result, queryClient } = renderHookWithProviders(() =>
      useRejectRoleRequest(),
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await act(async () => {
      await result.current.mutateAsync({
        requestId: "3",
        payload: {
          reviewNote: "Thiếu hồ sơ",
        },
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: roleRequestKeys.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationKeys.all,
    });
  });
});
