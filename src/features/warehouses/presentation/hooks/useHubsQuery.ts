"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResult } from "@/types/common.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AssignHubStaffInput,
  AssignHubDriverInput,
  HubAssignableUserRecord,
  HubAssignableUsersParams,
  HubDetailRecord,
  HubRecord,
  HubUpsertInput,
} from "@/features/warehouses/domain/types/hub.types";
import {
  assignHubDriverUseCase,
  assignHubStaffUseCase,
  createHubUseCase,
  deleteHubUseCase,
  getHubDetailUseCase,
  listHubAssignableUsersUseCase,
  listHubsUseCase,
  removeHubDriverUseCase,
  removeHubStaffUseCase,
  updateHubUseCase,
} from "@/features/warehouses/application/use-cases/warehouse.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useHubsQuery() {
  return useQuery<PaginatedResult<HubRecord>, ApiError>({
    queryKey: ["warehouses", "hubs"],
    queryFn: () => listHubsUseCase(),
  });
}

export function useHubDetailQuery(hubId: string, enabled = true) {
  return useQuery<HubDetailRecord, ApiError>({
    enabled: enabled && hubId.trim().length > 0,
    queryFn: () => getHubDetailUseCase(hubId),
    queryKey: ["warehouses", "hub", hubId],
  });
}

export function useHubAssignableUsersQuery(
  hubId: string,
  params: HubAssignableUsersParams,
  enabled = true,
) {
  return useQuery<HubAssignableUserRecord[], ApiError>({
    enabled: enabled && hubId.trim().length > 0,
    queryFn: () => listHubAssignableUsersUseCase(hubId, params),
    queryKey: ["warehouses", "hub", hubId, "assignable-users", params],
  });
}

export function useCreateHub() {
  const queryClient = useQueryClient();

  return useMutation<HubRecord, ApiError, HubUpsertInput>({
    mutationFn: createHubUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
}

export function useUpdateHub() {
  const queryClient = useQueryClient();

  return useMutation<HubRecord, ApiError, { hubId: string; payload: HubUpsertInput }>({
    mutationFn: ({ hubId, payload }) => updateHubUseCase(hubId, payload),
    onSuccess: (_record, variables) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId] });
    },
  });
}

export function useDeleteHub() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: deleteHubUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
}

export function useAssignHubStaff() {
  const queryClient = useQueryClient();

  return useMutation<
    HubDetailRecord["staff"][number],
    ApiError,
    { hubId: string; payload: AssignHubStaffInput }
  >({
    mutationFn: ({ hubId, payload }) => assignHubStaffUseCase(hubId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId] });
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId, "assignable-users"] });
    },
  });
}

export function useRemoveHubStaff() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    ApiError,
    { hubId: string; userId: number }
  >({
    mutationFn: ({ hubId, userId }) => removeHubStaffUseCase(hubId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId] });
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId, "assignable-users"] });
    },
  });
}

export function useAssignHubDriver() {
  const queryClient = useQueryClient();

  return useMutation<
    HubDetailRecord["staff"][number],
    ApiError,
    { hubId: string; payload: AssignHubDriverInput }
  >({
    mutationFn: ({ hubId, payload }) => assignHubDriverUseCase(hubId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId] });
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId, "assignable-users"] });
    },
  });
}

export function useRemoveHubDriver() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    ApiError,
    { hubId: string; userId: number }
  >({
    mutationFn: ({ hubId, userId }) => removeHubDriverUseCase(hubId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId] });
      queryClient.invalidateQueries({ queryKey: ["warehouses", "hub", variables.hubId, "assignable-users"] });
    },
  });
}
