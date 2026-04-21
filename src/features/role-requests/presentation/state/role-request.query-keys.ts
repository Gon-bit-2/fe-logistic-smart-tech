import type { RoleRequestListParams } from "@/features/role-requests/domain/types/role-request.types";

export const roleRequestKeys = {
  all: ["role-requests"] as const,
  adminList: (params?: RoleRequestListParams) =>
    [...roleRequestKeys.all, "admin-list", params] as const,
  myList: (params?: RoleRequestListParams) =>
    [...roleRequestKeys.all, "my-list", params] as const,
};
