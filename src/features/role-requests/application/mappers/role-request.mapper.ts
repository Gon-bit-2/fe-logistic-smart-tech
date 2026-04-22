import {
  type RoleRequestApiDto,
  type RoleRequestStatus,
  type RoleRequestViewModel,
  type TargetRoleName,
} from "@/features/role-requests/domain/types/role-request.types";
import { formatEnumLabel } from "@/utils/formatters";

function normalizeTargetRole(value?: string | null): TargetRoleName {
  return value?.trim().toUpperCase() === "WAREHOUSE_STAFF"
    ? "WAREHOUSE_STAFF"
    : "DRIVER";
}

function normalizeStatus(value?: string | null): RoleRequestStatus {
  if (value === "APPROVED" || value === "REJECTED" || value === "PENDING") {
    return value;
  }

  return "PENDING";
}

export function mapRoleRequestApiToViewModel(
  roleRequest: RoleRequestApiDto,
): RoleRequestViewModel {
  const targetRoleName = normalizeTargetRole(
    roleRequest.targetRoleName ?? roleRequest.targetRole?.name,
  );
  const status = normalizeStatus(roleRequest.status);
  const requester = roleRequest.requester ?? roleRequest.user;
  const hubId =
    roleRequest.assignedHubId ??
    (roleRequest.assignedHub?.id != null
      ? Number(roleRequest.assignedHub.id)
      : roleRequest.hubId ?? null);

  return {
    createdAt: roleRequest.createdAt ?? roleRequest.updatedAt ?? new Date().toISOString(),
    hubId,
    id: String(roleRequest.id),
    reason: roleRequest.reason?.trim() || "Không có mô tả bổ sung.",
    reviewNote: roleRequest.reviewNote?.trim() || null,
    reviewedAt: roleRequest.reviewedAt ?? null,
    reviewerName: roleRequest.reviewer?.fullName?.trim() || null,
    status,
    targetRoleLabel: formatEnumLabel(targetRoleName),
    targetRoleName,
    userDisplayName:
      requester?.fullName?.trim() ||
      requester?.email?.trim() ||
      "Người dùng hệ thống",
    userId:
      requester?.id != null
        ? String(requester.id)
        : roleRequest.requesterId != null
          ? String(roleRequest.requesterId)
          : roleRequest.userId != null
            ? String(roleRequest.userId)
          : null,
  };
}
