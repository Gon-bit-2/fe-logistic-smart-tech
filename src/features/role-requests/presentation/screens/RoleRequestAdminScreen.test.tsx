import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { renderWithProviders } from "@/test/render";
import RoleRequestAdminScreen from "./RoleRequestAdminScreen";

const approveMutation = vi.fn();
const rejectMutation = vi.fn();
const useAdminRoleRequestsQueryMock = vi.fn();

vi.mock("@/features/role-requests/presentation/hooks/useRoleRequests", () => ({
  useAdminRoleRequestsQuery: (...args: unknown[]) => useAdminRoleRequestsQueryMock(...args),
  useApproveRoleRequest: () => ({
    error: null,
    isPending: false,
    mutateAsync: approveMutation,
  }),
  useRejectRoleRequest: () => ({
    error: null,
    isPending: false,
    mutateAsync: rejectMutation,
  }),
}));

vi.mock("@/features/warehouses/presentation/hooks/useHubsQuery", () => ({
  useHubsQuery: () => ({
    data: {
      data: [
        {
          id: 3,
          code: "SGN-01",
          name: "Tan Binh Hub",
        },
      ],
    },
  }),
}));

describe("RoleRequestAdminScreen", () => {
  beforeEach(() => {
    approveMutation.mockReset();
    rejectMutation.mockReset();
    useAdminRoleRequestsQueryMock.mockReset();
    useAdminRoleRequestsQueryMock.mockReturnValue({
      data: {
        data: [
          {
            id: "88",
            userDisplayName: "Nguyen Van B",
            targetRoleLabel: "Warehouse Staff",
            targetRoleName: "WAREHOUSE_STAFF",
            status: "PENDING",
            reason: "Tôi muốn phụ trách xử lý hàng tại hub.",
            createdAt: "2026-04-20T09:00:00.000Z",
            reviewerName: null,
            reviewNote: null,
            hubId: null,
          },
        ],
        totalItems: 1,
      },
      isError: false,
      isPending: false,
    });
  });

  it("requires a hub before approving warehouse staff requests", () => {
    renderWithProviders(<RoleRequestAdminScreen />);

    expect(screen.getByText("admin.hubLabel")).toBeInTheDocument();
    expect(screen.getByText("admin.approveButton")).toBeDisabled();
  });

  it("submits approve payload with hubId for warehouse staff requests", () => {
    renderWithProviders(<RoleRequestAdminScreen />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByText("admin.approveButton"));

    expect(approveMutation).toHaveBeenCalledWith({
      requestId: "88",
      payload: {
        hubId: 3,
        reviewNote: undefined,
      },
    });
  });

  it("hides raw backend details when the admin queue cannot be loaded", () => {
    useAdminRoleRequestsQueryMock.mockReturnValue({
      error: new ApiError({
        message:
          "Invalid `prisma.roleRequest.findMany()` invocation: The table `public.role_requests` does not exist in the current database.",
        status: 500,
      }),
      isError: true,
      isPending: false,
    });

    renderWithProviders(<RoleRequestAdminScreen />);

    expect(screen.getByText("Không thể tải hàng chờ yêu cầu vai trò")).toBeInTheDocument();
    expect(screen.getByText("admin.loadErrorFallback")).toBeInTheDocument();
    expect(
      screen.queryByText(/Invalid `prisma\.roleRequest\.findMany\(\)` invocation/i),
    ).not.toBeInTheDocument();
  });
});
