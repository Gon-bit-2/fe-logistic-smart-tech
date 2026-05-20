import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { renderWithProviders } from "@/test/render";
import RoleRequestCenterScreen from "./RoleRequestCenterScreen";

const useMyRoleRequestsQueryMock = vi.fn();

vi.mock("@/features/auth/presentation/hooks/useAuthSession", () => ({
  useAuthSession: () => ({
    user: {
      role: "customer",
    },
  }),
}));

vi.mock("@/features/role-requests/presentation/hooks/useRoleRequests", () => ({
  useCreateRoleRequest: () => ({
    error: null,
    isPending: false,
    mutateAsync: vi.fn(),
  }),
  useMyRoleRequestsQuery: (...args: unknown[]) => useMyRoleRequestsQueryMock(...args),
}));

describe("RoleRequestCenterScreen", () => {
  beforeEach(() => {
    useMyRoleRequestsQueryMock.mockReset();
    useMyRoleRequestsQueryMock.mockReturnValue({
      data: {
        data: [
          {
            id: "88",
            targetRoleLabel: "Driver",
            targetRoleName: "DRIVER",
            status: "PENDING",
            reason: "Tôi muốn làm tài xế.",
            createdAt: "2026-04-20T09:00:00.000Z",
            reviewerName: null,
            reviewNote: null,
          },
        ],
        totalItems: 1,
      },
      isError: false,
      isPending: false,
    });
  });

  it("disables submit when there is already a pending request", () => {
    renderWithProviders(<RoleRequestCenterScreen />);

    expect(screen.getByText("center.pendingBanner")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "center.submitLabel" })).toBeDisabled();
  });

  it("hides raw backend details when role request history cannot be loaded", () => {
    useMyRoleRequestsQueryMock.mockReturnValue({
      error: new ApiError({
        message:
          "Invalid `prisma.roleRequest.findMany()` invocation: The table `public.role_requests` does not exist in the current database.",
        status: 500,
      }),
      isError: true,
      isPending: false,
    });

    renderWithProviders(<RoleRequestCenterScreen />);

    expect(screen.getByText("Không thể tải yêu cầu vai trò")).toBeInTheDocument();
    expect(screen.getByText("center.loadErrorFallback")).toBeInTheDocument();
    expect(
      screen.queryByText(/Invalid `prisma\.roleRequest\.findMany\(\)` invocation/i),
    ).not.toBeInTheDocument();
  });
});
