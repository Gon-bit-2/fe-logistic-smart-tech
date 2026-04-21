"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApproveRoleRequestInput,
  CreateRoleRequestInput,
  RejectRoleRequestInput,
  RoleRequestListParams,
  RoleRequestViewModel,
} from "@/features/role-requests/domain/types/role-request.types";
import {
  approveRoleRequestUseCase,
  createRoleRequestUseCase,
  listAdminRoleRequestsUseCase,
  listMyRoleRequestsUseCase,
  rejectRoleRequestUseCase,
} from "@/features/role-requests/application/use-cases/role-request.use-cases";
import { roleRequestKeys } from "@/features/role-requests/presentation/state/role-request.query-keys";
import { notificationKeys } from "@/features/notifications/presentation/state/notification.query-keys";
import { ApiError } from "@/lib/api/errors";
import type { PaginatedResult } from "@/types/common.type";

export function useMyRoleRequestsQuery(params?: RoleRequestListParams) {
  return useQuery<PaginatedResult<RoleRequestViewModel>, ApiError>({
    queryFn: () => listMyRoleRequestsUseCase(params),
    queryKey: roleRequestKeys.myList(params),
  });
}

export function useAdminRoleRequestsQuery(params?: RoleRequestListParams) {
  return useQuery<PaginatedResult<RoleRequestViewModel>, ApiError>({
    queryFn: () => listAdminRoleRequestsUseCase(params),
    queryKey: roleRequestKeys.adminList(params),
  });
}

function invalidateDependencies(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: roleRequestKeys.all });
  queryClient.invalidateQueries({ queryKey: notificationKeys.all });
}

export function useCreateRoleRequest() {
  const queryClient = useQueryClient();

  return useMutation<RoleRequestViewModel, ApiError, CreateRoleRequestInput>({
    mutationFn: createRoleRequestUseCase,
    onSuccess: () => {
      invalidateDependencies(queryClient);
    },
  });
}

export function useApproveRoleRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    RoleRequestViewModel,
    ApiError,
    { payload: ApproveRoleRequestInput; requestId: string }
  >({
    mutationFn: ({ requestId, payload }) => approveRoleRequestUseCase(requestId, payload),
    onSuccess: () => {
      invalidateDependencies(queryClient);
    },
  });
}

export function useRejectRoleRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    RoleRequestViewModel,
    ApiError,
    { payload: RejectRoleRequestInput; requestId: string }
  >({
    mutationFn: ({ requestId, payload }) => rejectRoleRequestUseCase(requestId, payload),
    onSuccess: () => {
      invalidateDependencies(queryClient);
    },
  });
}
