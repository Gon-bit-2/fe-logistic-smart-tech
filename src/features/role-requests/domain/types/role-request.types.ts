import type { PaginationParams } from "@/types/common.type";

export type TargetRoleName = "DRIVER" | "WAREHOUSE_STAFF";

export type RoleRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type RoleRequestApiDto = {
  assignedHub?: {
    code?: string | null;
    id?: number | string | null;
    name?: string | null;
  } | null;
  assignedHubId?: number | null;
  createdAt?: string | null;
  currentRole?: {
    id?: number | string | null;
    name?: string | null;
  } | null;
  currentRoleId?: number | string | null;
  hubId?: number | null;
  id: number | string;
  requester?: {
    email?: string | null;
    fullName?: string | null;
    id?: number | string | null;
  } | null;
  requesterId?: number | string | null;
  reason?: string | null;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  reviewer?: {
    fullName?: string | null;
    id?: number | string | null;
  } | null;
  reviewedById?: number | null;
  status?: RoleRequestStatus | string | null;
  targetRole?: {
    id?: number | string | null;
    name?: string | null;
  } | null;
  targetRoleId?: number | string | null;
  targetRoleName?: TargetRoleName | string | null;
  updatedAt?: string | null;
  user?: {
    email?: string | null;
    fullName?: string | null;
    id?: number | string | null;
  } | null;
  userId?: number | string | null;
};

export type RoleRequestListParams = PaginationParams & {
  status?: RoleRequestStatus;
};

export type CreateRoleRequestInput = {
  reason: string;
  targetRoleName: TargetRoleName;
};

export type ApproveRoleRequestInput = {
  hubId?: number;
  reviewNote?: string;
};

export type RejectRoleRequestInput = {
  reviewNote?: string;
};

export type RoleRequestViewModel = {
  createdAt: string;
  hubId: number | null;
  id: string;
  reason: string;
  reviewNote: string | null;
  reviewedAt: string | null;
  reviewerName: string | null;
  status: RoleRequestStatus;
  targetRoleLabel: string;
  targetRoleName: TargetRoleName;
  userDisplayName: string;
  userId: string | null;
};
