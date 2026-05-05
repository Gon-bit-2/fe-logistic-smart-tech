"use client";

import { Link } from "@/i18n/routing";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckSquare,
  ChevronDown,
  Loader2,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";
import { useI18nCopy } from "@/i18n/useCopy";
import {
  useAddOrdersToTrip,
  useApproveAssignmentRequest,
  useAssignVehicleToTrip,
  useAssignmentRequestInboxQuery,
  useDispatchBoardQuery,
  useDispatchPreview,
  useManualCreateTrip,
  useRejectAssignmentRequest,
  useTripsQuery,
  useUpdateTripStatus,
} from "@/features/trips/presentation/hooks/useTrips";
import {
  getTripStatusLabel,
  getTripStatusTone,
} from "@/features/trips/presentation/lib/trip-status";
import {
  MetricCard,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { cn } from "@/lib/utils";
import type {
  AssignmentRequestInboxItem,
  DispatchBoardPendingTrip,
  DispatchBoardVehicle,
  DispatchPreviewResult,
  TripStatus,
  TripViewModel,
} from "@/features/trips/domain/types/trip.types";

type TripsManagementScreenProps = {
  scope: "admin" | "warehouse" | "driver";
};

type DispatchMode = "new" | "pending";

function getOrderTone(status: string) {
  switch (status) {
    case "DELIVERED":
      return "green" as const;
    case "CANCELLED":
      return "red" as const;
    case "ASSIGNED":
    case "OUT_FOR_DELIVERY":
    case "IN_TRANSIT":
      return "blue" as const;
    case "ARRIVED_AT_HUB":
    case "PICKED_UP":
    case "PENDING":
    default:
      return "amber" as const;
  }
}

function getTripCapacity(vehicle: DispatchBoardVehicle | undefined, trip?: DispatchBoardPendingTrip) {
  if (!vehicle) {
    return {
      remainingVolume: trip?.remainingVolume ?? 0,
      remainingWeight: trip?.remainingWeight ?? 0,
    };
  }

  return {
    remainingVolume: Math.max(vehicle.capacityVolume - (trip?.totalAssignedVolume ?? 0), 0),
    remainingWeight: Math.max(vehicle.capacityWeight - (trip?.totalAssignedWeight ?? 0), 0),
  };
}

export default function TripsManagementScreen({
  scope,
}: Readonly<TripsManagementScreenProps>) {
  const { getOrderStatusLabel } = useI18nCopy();
  const isDriverView = scope === "driver";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHubId, setSelectedHubId] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | "PENDING" | "ARRIVED_AT_HUB">("ALL");
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [dispatchMode, setDispatchMode] = useState<DispatchMode>("new");
  const [selectedTripId, setSelectedTripId] = useState<number | "">("");
  const [selectedDriverId, setSelectedDriverId] = useState<number | "">("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | "">("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualError, setManualError] = useState("");
  const [requestFormState, setRequestFormState] = useState<
    Record<number, { reviewNote: string; tripId: string; vehicleId: string }>
  >({});

  const hubsQuery = useHubsQuery();
  const resolvedAdminHubId =
    selectedHubId || String(hubsQuery.data?.data[0]?.id ?? "");
  const boardHubId =
    scope === "admin" && resolvedAdminHubId ? Number(resolvedAdminHubId) : undefined;
  const boardQuery = useDispatchBoardQuery(
    isDriverView ? undefined : { hubId: boardHubId },
    !isDriverView,
  );
  const tripsQuery = useTripsQuery(
    scope === "admin" && resolvedAdminHubId
      ? { hubId: Number(resolvedAdminHubId) }
      : undefined,
  );
  const updateTripStatus = useUpdateTripStatus();
  const dispatchPreview = useDispatchPreview();
  const createManualTrip = useManualCreateTrip();
  const assignTripResources = useAssignVehicleToTrip();
  const addOrdersToTrip = useAddOrdersToTrip();
  const assignmentRequestInbox = useAssignmentRequestInboxQuery(!isDriverView && scope === "warehouse");
  const approveAssignmentRequest = useApproveAssignmentRequest();
  const rejectAssignmentRequest = useRejectAssignmentRequest();

  const board = boardQuery.data;
  const selectedTrip = useMemo(
    () => board?.pendingTrips.find((trip) => trip.id === selectedTripId) ?? null,
    [board?.pendingTrips, selectedTripId],
  );
  const selectedVehicle = useMemo(
    () =>
      board?.vehicles.find((vehicle) => vehicle.id === Number(selectedVehicleId)) ??
      undefined,
    [board?.vehicles, selectedVehicleId],
  );
  const selectedDriver = useMemo(
    () =>
      board?.drivers.find((driver) => driver.id === Number(selectedDriverId)) ?? undefined,
    [board?.drivers, selectedDriverId],
  );

  useEffect(() => {
    if (!selectedTrip || dispatchMode !== "pending") {
      return;
    }

    queueMicrotask(() => {
      setSelectedDriverId(selectedTrip.driverId);
      setSelectedVehicleId(selectedTrip.vehicleId);
    });
  }, [dispatchMode, selectedTrip]);

  const filteredTrips = (tripsQuery.data?.data ?? []).filter((trip) => {
    if (!searchTerm.trim()) {
      return true;
    }

    return [trip.id, trip.driverName, trip.vehicleLicensePlate]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
  });

  const filteredDispatchableOrders = useMemo(() => {
    const normalizedSearch = orderSearch.trim().toLowerCase();
    return (board?.dispatchableOrders ?? []).filter((order) => {
      const matchesStatus =
        orderStatusFilter === "ALL" || order.status === orderStatusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [order.trackingCode, order.receiverName, order.receiverAddress, order.senderAddress]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [board?.dispatchableOrders, orderSearch, orderStatusFilter]);

  const selectedOrders = useMemo(
    () =>
      (board?.dispatchableOrders ?? []).filter((order) =>
        selectedOrderIds.includes(order.id),
      ),
    [board?.dispatchableOrders, selectedOrderIds],
  );

  const selectedOrderWeight = selectedOrders.reduce(
    (sum, order) => sum + order.totalWeight,
    0,
  );
  const selectedOrderVolume = selectedOrders.reduce(
    (sum, order) => sum + order.totalVolume,
    0,
  );

  const capacity = getTripCapacity(selectedVehicle, selectedTrip ?? undefined);
  const exceedsWeight = selectedOrderWeight > capacity.remainingWeight;
  const exceedsVolume = selectedOrderVolume > capacity.remainingVolume;
  const hasCapacityError =
    Boolean(selectedVehicleId) && (exceedsWeight || exceedsVolume);
  const canSubmitManual =
    selectedOrderIds.length > 0 &&
    Boolean(selectedDriverId) &&
    Boolean(selectedVehicleId) &&
    !hasCapacityError &&
    (dispatchMode === "new" || Boolean(selectedTripId));

  function toggleOrder(orderId: number) {
    setSelectedOrderIds((current) =>
      current.includes(orderId)
        ? current.filter((item) => item !== orderId)
        : [...current, orderId],
    );
  }

  function toggleAllVisibleOrders() {
    const visibleIds = filteredDispatchableOrders.map((order) => order.id);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedOrderIds.includes(id));

    setSelectedOrderIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  }

  function resetManualForm() {
    setDispatchMode("new");
    setSelectedTripId("");
    setSelectedDriverId("");
    setSelectedVehicleId("");
    setSelectedOrderIds([]);
    setManualError("");
  }

  function applySuggestion(result: DispatchPreviewResult["suggestions"][number]) {
    setShowSuggestions(true);
    setDispatchMode("new");
    setSelectedTripId("");
    setSelectedDriverId(result.driverId);
    setSelectedVehicleId(result.vehicleId);
    setSelectedOrderIds(result.orderIds);
    setManualError("");
  }

  async function handleManualSubmit() {
    if (!board || !canSubmitManual) {
      return;
    }

    setManualError("");

    try {
      if (dispatchMode === "new") {
        await createManualTrip.mutateAsync({
          driverId: Number(selectedDriverId),
          hubId: board.hubId,
          orderIds: selectedOrderIds,
          vehicleId: Number(selectedVehicleId),
        });
      } else if (selectedTripId) {
        await assignTripResources.mutateAsync({
          payload: {
            driverId: Number(selectedDriverId),
            vehicleId: Number(selectedVehicleId),
          },
          tripId: selectedTripId,
        });
        await addOrdersToTrip.mutateAsync({
          payload: {
            orderIds: selectedOrderIds,
          },
          tripId: selectedTripId,
        });
      }

      resetManualForm();
      await boardQuery.refetch();
      await tripsQuery.refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể cập nhật điều phối chuyến.";
      setManualError(message);
    }
  }

  async function handleLoadSuggestions() {
    setShowSuggestions(true);
    await dispatchPreview.mutateAsync(
      scope === "admin" ? { hubId: Number(resolvedAdminHubId) } : undefined,
    );
  }

  function getRequestFormValue(requestId: number) {
    return (
      requestFormState[requestId] ?? {
        reviewNote: "",
        tripId: "",
        vehicleId: "",
      }
    );
  }

  function updateRequestForm(
    requestId: number,
    patch: Partial<{ reviewNote: string; tripId: string; vehicleId: string }>,
  ) {
    setRequestFormState((current) => ({
      ...current,
      [requestId]: {
        ...(current[requestId] ?? {
          reviewNote: "",
          tripId: "",
          vehicleId: "",
        }),
        ...patch,
      },
    }));
  }

  async function handleApproveRequest(request: AssignmentRequestInboxItem) {
    const form = getRequestFormValue(request.id);
    const hasSinglePendingTrip = request.pendingTripsForDriver.length === 1;
    const payload = hasSinglePendingTrip
      ? {}
      : form.tripId
        ? { tripId: Number(form.tripId) }
        : form.vehicleId
          ? { vehicleId: Number(form.vehicleId) }
          : {};

    await approveAssignmentRequest.mutateAsync({
      payload,
      requestId: request.id,
    });
  }

  async function handleRejectRequest(request: AssignmentRequestInboxItem) {
    const form = getRequestFormValue(request.id);
    if (!form.reviewNote.trim()) {
      return;
    }

    await rejectAssignmentRequest.mutateAsync({
      payload: {
        reviewNote: form.reviewNote.trim(),
      },
      requestId: request.id,
    });
  }

  if (isDriverView) {
    return (
      <DriverTripsPanel
        filteredTrips={filteredTrips}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tripsQuery={tripsQuery}
        updateTripStatus={updateTripStatus}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-8 py-5 md:py-7">
      <PageHeader
        eyebrow="Trip Control"
        title="Điều phối chuyến đi"
        description="Nhân viên kho có thể chọn đơn chưa phân, gán tài xế và xe, rồi tạo chuyến mới hoặc thêm vào chuyến chờ khởi hành."
        actions={
          <>
            {scope === "admin" ? (
              <select
                value={resolvedAdminHubId}
                onChange={(event) => setSelectedHubId(event.target.value)}
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
              >
                {(hubsQuery.data?.data ?? []).map((hub) => (
                  <option key={hub.id} value={String(hub.id)}>
                    {hub.code} - {hub.name}
                  </option>
                ))}
              </select>
            ) : null}
            <button
              type="button"
              onClick={() => void handleLoadSuggestions()}
              disabled={dispatchPreview.isPending || (scope === "admin" && !resolvedAdminHubId)}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 disabled:opacity-50"
            >
              {dispatchPreview.isPending ? "Đang tạo gợi ý..." : "Lấy gợi ý tự động"}
            </button>
          </>
        }
      />

      {boardQuery.isLoading ? (
        <SectionCard className="flex min-h-[16rem] items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            <Loader2 className="size-5 animate-spin text-emerald-600" />
            Đang tải bảng điều phối...
          </div>
        </SectionCard>
      ) : null}

      {boardQuery.isError ? (
        <SectionCard className="border-red-200">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle className="mt-0.5 size-5" />
            <div>
              <p className="font-semibold">Không tải được dữ liệu điều phối</p>
              <p className="mt-1 text-sm">
                {boardQuery.error.message}
              </p>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {board ? (
        <>
          <div className="grid gap-4 lg:grid-cols-4">
            <MetricCard
              accent="green"
              detail="Đơn ở trạng thái chờ điều phối tại hub"
              icon={<Warehouse className="size-5" />}
              label="Đơn chưa phân"
              value={String(board.summary.dispatchableOrderCount)}
            />
            <MetricCard
              accent="blue"
              detail="Tài xế sẵn sàng nhận chuyến mới"
              icon={<Users className="size-5" />}
              label="Tài xế rảnh"
              value={String(board.summary.availableDriverCount)}
            />
            <MetricCard
              accent="dark"
              detail="Xe đang khả dụng để mở chuyến"
              icon={<Truck className="size-5" />}
              label="Xe sẵn sàng"
              value={String(board.summary.availableVehicleCount)}
            />
            <MetricCard
              accent="green"
              detail="Các chuyến có thể thêm đơn hoặc đổi tài xế, xe"
              icon={<CheckSquare className="size-5" />}
              label="Chuyến chờ"
              value={String(board.summary.pendingTripCount)}
            />
          </div>

          {scope === "warehouse" ? (
            <SectionCard className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    Request từ tài xế
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    Staff duyệt trực tiếp trong màn điều phối
                  </h2>
                </div>
                <div className="text-sm text-slate-600">
                  {assignmentRequestInbox.data?.totalItems ?? 0} yêu cầu đang chờ
                </div>
              </div>

              {assignmentRequestInbox.isPending ? (
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
                  <Loader2 className="size-4 animate-spin text-emerald-600" />
                  Đang tải request tài xế...
                </div>
              ) : assignmentRequestInbox.isError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  {assignmentRequestInbox.error.message}
                </div>
              ) : assignmentRequestInbox.data?.data.length ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {assignmentRequestInbox.data.data.map((request) => {
                    const form = getRequestFormValue(request.id);
                    const shouldPickTrip = request.pendingTripsForDriver.length > 1;
                    const canApprove =
                      request.pendingTripsForDriver.length === 1 ||
                      Boolean(form.tripId) ||
                      Boolean(form.vehicleId);

                    return (
                      <div
                        key={request.id}
                        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {request.orderTrackingCode} • {request.driverName}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {request.order.receiverName || "Chưa có người nhận"} •{" "}
                              {request.order.receiverAddress || "Chưa có địa chỉ nhận"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {request.order.totalWeight.toFixed(1)} kg •{" "}
                              {request.order.totalVolume.toFixed(2)} m3
                            </p>
                          </div>
                          <StatusBadge label="Đang chờ" tone="amber" />
                        </div>

                        {request.pendingTripsForDriver.length > 0 ? (
                          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {request.pendingTripsForDriver.length === 1
                              ? `Tài xế đã có 1 chuyến chờ #${request.pendingTripsForDriver[0].id}; khi duyệt hệ thống sẽ thêm đơn vào chuyến này.`
                              : "Tài xế có nhiều chuyến chờ, hãy chọn đúng chuyến để thêm đơn."}
                          </div>
                        ) : (
                          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Tài xế chưa có chuyến chờ. Staff cần chọn xe để tạo chuyến mới khi duyệt.
                          </div>
                        )}

                        {shouldPickTrip ? (
                          <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">
                              Chuyến chờ của tài xế
                            </span>
                            <select
                              value={form.tripId}
                              onChange={(event) =>
                                updateRequestForm(request.id, {
                                  tripId: event.target.value,
                                  vehicleId: "",
                                })
                              }
                              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            >
                              <option value="">Chọn chuyến để thêm đơn</option>
                              {request.pendingTripsForDriver.map((trip) => (
                                <option key={trip.id} value={trip.id}>
                                  Chuyến #{trip.id} - {trip.vehicleLicensePlate}
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : null}

                        {request.pendingTripsForDriver.length === 0 ? (
                          <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">
                              Xe dùng để mở chuyến mới
                            </span>
                            <select
                              value={form.vehicleId}
                              onChange={(event) =>
                                updateRequestForm(request.id, {
                                  tripId: "",
                                  vehicleId: event.target.value,
                                })
                              }
                              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            >
                              <option value="">Chọn xe</option>
                              {board.vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                  {vehicle.licensePlate} - {vehicle.capacityWeight} kg / {vehicle.capacityVolume} m3
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : null}

                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-slate-700">
                            Ghi chú khi từ chối
                          </span>
                          <textarea
                            value={form.reviewNote}
                            onChange={(event) =>
                              updateRequestForm(request.id, {
                                reviewNote: event.target.value,
                              })
                            }
                            className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
                            placeholder="Nêu rõ lý do để tài xế dễ xử lý tiếp..."
                          />
                        </label>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => void handleApproveRequest(request)}
                            disabled={approveAssignmentRequest.isPending || !canApprove}
                            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {approveAssignmentRequest.isPending
                              ? "Đang duyệt..."
                              : "Duyệt và phân đơn"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleRejectRequest(request)}
                            disabled={
                              rejectAssignmentRequest.isPending || !form.reviewNote.trim()
                            }
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700"
                          >
                            {rejectAssignmentRequest.isPending
                              ? "Đang từ chối..."
                              : "Từ chối"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Hiện chưa có request nào từ tài xế trong hub này.
                </p>
              )}
            </SectionCard>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            <SectionCard className="p-0">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                      Đơn chưa phân
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      Chọn 1 hoặc nhiều đơn để điều phối thủ công
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={orderSearch}
                      onChange={(event) => setOrderSearch(event.target.value)}
                      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                      placeholder="Tìm theo mã, người nhận, địa chỉ..."
                    />
                    <select
                      value={orderStatusFilter}
                      onChange={(event) =>
                        setOrderStatusFilter(
                          event.target.value as "ALL" | "PENDING" | "ARRIVED_AT_HUB",
                        )
                      }
                      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="ALL">Tất cả đơn chờ phân</option>
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="ARRIVED_AT_HUB">Đã nhập kho</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleAllVisibleOrders()}
                    className="text-sm font-semibold text-emerald-700"
                  >
                    {filteredDispatchableOrders.length > 0 &&
                    filteredDispatchableOrders.every((order) =>
                      selectedOrderIds.includes(order.id),
                    )
                      ? "Bỏ chọn các đơn đang hiển thị"
                      : "Chọn các đơn đang hiển thị"}
                  </button>
                  <div className="text-sm text-slate-600">
                    Đã chọn <span className="font-bold text-slate-900">{selectedOrderIds.length}</span> đơn •{" "}
                    {selectedOrderWeight.toFixed(1)} kg • {selectedOrderVolume.toFixed(2)} m3
                  </div>
                </div>
              </div>

              <div className="max-h-[34rem] overflow-auto">
                {filteredDispatchableOrders.length === 0 ? (
                  <div className="px-6 py-10 text-sm text-slate-500">
                    Không còn đơn phù hợp với bộ lọc hiện tại.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredDispatchableOrders.map((order) => {
                      const isSelected = selectedOrderIds.includes(order.id);
                      return (
                        <button
                          key={order.id}
                          type="button"
                          onClick={() => toggleOrder(order.id)}
                          className={cn(
                            "grid w-full gap-3 px-6 py-4 text-left transition-colors lg:grid-cols-[auto_1.2fr_1fr_auto]",
                            isSelected
                              ? "bg-emerald-50/70"
                              : "hover:bg-slate-50",
                          )}
                        >
                          <div className="pt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="size-4 rounded border-slate-300 text-emerald-600"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {order.trackingCode ?? `ORD-${order.id}`}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {order.receiverName || "Chưa có người nhận"} •{" "}
                              {order.receiverAddress || "Chưa có địa chỉ nhận"}
                            </p>
                          </div>
                          <div className="text-sm text-slate-600">
                            <p>{order.senderAddress || "Chưa có địa chỉ gửi"}</p>
                            <p className="mt-1">
                              {order.totalWeight.toFixed(1)} kg • {order.totalVolume.toFixed(2)} m3
                            </p>
                          </div>
                          <div className="justify-self-start lg:justify-self-end">
                            <StatusBadge
                              label={getOrderStatusLabel(order.status)}
                              tone={getOrderTone(order.status)}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </SectionCard>

            <div className="space-y-6">
              <SectionCard className="space-y-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    Điều phối thủ công
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    Gán tài xế và xe cho đơn đã chọn
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDispatchMode("new");
                      setSelectedTripId("");
                    }}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left",
                      dispatchMode === "new"
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white",
                    )}
                  >
                    <p className="font-semibold text-slate-900">Tạo chuyến mới</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Dùng tài xế và xe rảnh để mở chuyến mới.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode("pending")}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left",
                      dispatchMode === "pending"
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white",
                    )}
                  >
                    <p className="font-semibold text-slate-900">Thêm vào chuyến chờ</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Chọn chuyến `PENDING` rồi cập nhật tài xế, xe nếu cần.
                    </p>
                  </button>
                </div>

                {dispatchMode === "pending" ? (
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Chuyến chờ</span>
                    <select
                      value={selectedTripId}
                      onChange={(event) => setSelectedTripId(Number(event.target.value) || "")}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="">Chọn chuyến chờ khởi hành</option>
                      {board.pendingTrips.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                          Chuyến #{trip.id} - {trip.vehicleLicensePlate} - {trip.driverName}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Tài xế</span>
                    <select
                      value={selectedDriverId}
                      onChange={(event) => setSelectedDriverId(Number(event.target.value) || "")}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="">Chọn tài xế</option>
                      {board.drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.fullName} {driver.isAvailable ? "- Rảnh" : `- ${getTripStatusLabel((driver.activeTripStatus ?? "PENDING") as TripStatus)}`}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Xe</span>
                    <select
                      value={selectedVehicleId}
                      onChange={(event) => setSelectedVehicleId(Number(event.target.value) || "")}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="">Chọn xe</option>
                      {board.vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.licensePlate} - {vehicle.capacityWeight} kg / {vehicle.capacityVolume} m3
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">Sức chứa còn lại</span>
                    <span>
                      {capacity.remainingWeight.toFixed(1)} kg • {capacity.remainingVolume.toFixed(2)} m3
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">
                    Đơn đã chọn đang chiếm {selectedOrderWeight.toFixed(1)} kg •{" "}
                    {selectedOrderVolume.toFixed(2)} m3.
                  </p>
                  {hasCapacityError ? (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                      Khối lượng hoặc thể tích vượt quá sức chứa của xe/chuyến được chọn.
                    </p>
                  ) : null}
                </div>

                {selectedDriver ? (
                  <ResourceSummaryCard
                    title="Tài xế được chọn"
                    subtitle={selectedDriver.fullName}
                    supporting={
                      selectedDriver.isAvailable
                        ? "Hiện đang rảnh"
                        : `Đang có chuyến #${selectedDriver.activeTripId}`
                    }
                  />
                ) : null}

                {selectedVehicle ? (
                  <ResourceSummaryCard
                    title="Xe được chọn"
                    subtitle={selectedVehicle.licensePlate}
                    supporting={`${selectedVehicle.capacityWeight} kg • ${selectedVehicle.capacityVolume} m3`}
                  />
                ) : null}

                {manualError ? (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {manualError}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleManualSubmit()}
                    disabled={
                      !canSubmitManual ||
                      createManualTrip.isPending ||
                      assignTripResources.isPending ||
                      addOrdersToTrip.isPending
                    }
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {createManualTrip.isPending || assignTripResources.isPending || addOrdersToTrip.isPending
                      ? "Đang cập nhật..."
                      : dispatchMode === "new"
                        ? "Tạo chuyến thủ công"
                        : "Thêm đơn vào chuyến chờ"}
                  </button>
                  <button
                    type="button"
                    onClick={() => resetManualForm()}
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700"
                  >
                    Làm lại
                  </button>
                </div>
              </SectionCard>

              <SectionCard className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowSuggestions((current) => !current)}
                  className="flex w-full items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                      Gợi ý tự động
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      Panel hỗ trợ, không phải workflow chính
                    </h2>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-5 text-slate-500 transition-transform",
                      showSuggestions && "rotate-180",
                    )}
                  />
                </button>

                {showSuggestions ? (
                  dispatchPreview.data?.suggestions?.length ? (
                    <div className="space-y-3">
                      {dispatchPreview.data.suggestions.map((suggestion) => (
                        <div
                          key={`${suggestion.vehicleId}-${suggestion.driverId}-${suggestion.orderIds.join("-")}`}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {suggestion.vehicleLicensePlate ?? `Xe #${suggestion.vehicleId}`} •{" "}
                                {suggestion.driverName ?? `Tài xế #${suggestion.driverId}`}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {suggestion.orderIds.length} đơn • {suggestion.totalWeight.toFixed(1)} kg
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => applySuggestion(suggestion)}
                              className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800"
                            >
                              Nạp vào form manual
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Chưa có gợi ý. Bấm `Lấy gợi ý tự động` để hệ thống tạo đề xuất.
                    </p>
                  )
                ) : null}
              </SectionCard>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <SectionCard className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                  Tài xế & xe
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Danh sách tài nguyên tại hub
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">Tài xế</p>
                  {board.drivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{driver.fullName}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {driver.phone || "Chưa có số điện thoại"}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <StatusBadge
                            label={
                              driver.isAvailable
                                ? "Đang rảnh"
                                : `Chuyến #${driver.activeTripId}`
                            }
                            tone={driver.isAvailable ? "green" : "amber"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">Xe</p>
                  {board.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{vehicle.licensePlate}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {vehicle.capacityWeight} kg • {vehicle.capacityVolume} m3
                          </p>
                        </div>
                        <div className="shrink-0">
                          <StatusBadge
                            label={vehicle.isAvailable ? "Sẵn sàng" : `Chuyến #${vehicle.activeTripId}`}
                            tone={vehicle.isAvailable ? "green" : "amber"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                  Chuyến chờ khởi hành
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Các chuyến có thể tiếp tục phân đơn
                </h2>
              </div>

              {board.pendingTrips.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Chưa có chuyến nào đang chờ khởi hành ở hub này.
                </p>
              ) : (
                <div className="space-y-3">
                  {board.pendingTrips.map((trip) => (
                    <button
                      key={trip.id}
                      type="button"
                      onClick={() => {
                        setDispatchMode("pending");
                        setSelectedTripId(trip.id);
                      }}
                      className={cn(
                        "w-full rounded-lg border px-4 py-4 text-left transition-colors",
                        selectedTripId === trip.id && dispatchMode === "pending"
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      )}
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">
                            Chuyến #{trip.id} • {trip.vehicleLicensePlate}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {trip.driverName} • {trip.orderCount} đơn • còn {trip.remainingWeight.toFixed(1)} kg
                          </p>
                        </div>
                        <StatusBadge
                          label={getTripStatusLabel(trip.status)}
                          tone={getTripStatusTone(trip.status)}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <SectionCard className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                  Danh sách chuyến
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Theo dõi trạng thái vận hành
                </h2>
              </div>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700"
                placeholder="Tìm theo tài xế, biển số, mã chuyến..."
              />
            </div>

            {tripsQuery.isPending ? (
              <p className="text-sm text-slate-500">Đang tải danh sách chuyến...</p>
            ) : (
              <div className="space-y-3">
                {filteredTrips.map((trip) => (
                  <article
                    key={trip.id}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                          Trip #{trip.id}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                          {trip.vehicleLicensePlate}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {trip.driverName} • {trip.orderCount} đơn
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                          label={getTripStatusLabel(trip.status)}
                          tone={getTripStatusTone(trip.status)}
                        />
                        {trip.status === "PENDING" ? (
                          <button
                            type="button"
                            onClick={() =>
                              void updateTripStatus.mutateAsync({
                                payload: { status: "IN_PROGRESS" },
                                tripId: trip.id,
                              })
                            }
                            disabled={updateTripStatus.isPending}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
                          >
                            Bắt đầu chuyến
                          </button>
                        ) : null}
                        {trip.status === "IN_PROGRESS" ? (
                          <button
                            type="button"
                            onClick={() =>
                              void updateTripStatus.mutateAsync({
                                payload: { status: "COMPLETED" },
                                tripId: trip.id,
                              })
                            }
                            disabled={updateTripStatus.isPending}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
                          >
                            Hoàn tất
                          </button>
                        ) : null}
                        <Link
                          href={`/dashboard/driver/trips/${trip.id}`}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Mở chi tiết
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </SectionCard>
        </>
      ) : null}
    </div>
  );
}

function ResourceSummaryCard({
  title,
  subtitle,
  supporting,
}: Readonly<{
  title: string;
  subtitle: string;
  supporting: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 font-semibold text-slate-900">{subtitle}</p>
      <p className="mt-1 text-sm text-slate-600">{supporting}</p>
    </div>
  );
}

function DriverTripsPanel({
  filteredTrips,
  searchTerm,
  setSearchTerm,
  tripsQuery,
  updateTripStatus,
}: Readonly<{
  filteredTrips: TripViewModel[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  tripsQuery: ReturnType<typeof useTripsQuery>;
  updateTripStatus: ReturnType<typeof useUpdateTripStatus>;
}>) {
  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-8 py-5 md:py-7">
      <PageHeader
        eyebrow="Driver Workspace"
        title="Danh sách chuyến của tài xế"
        description="Theo dõi các chuyến được giao và cập nhật trạng thái thực hiện."
      />

      <input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="h-11 max-w-md rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700"
        placeholder="Tìm theo biển số, mã chuyến..."
      />

      {tripsQuery.isPending ? (
        <SectionCard className="text-sm text-slate-500">
          Đang tải danh sách chuyến...
        </SectionCard>
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((trip) => (
            <article
              key={trip.id}
              className="rounded-lg border border-slate-200 bg-white px-5 py-4"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                    Trip #{trip.id}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    {trip.vehicleLicensePlate}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {trip.driverName} • {trip.orderCount} đơn
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={getTripStatusLabel(trip.status)}
                    tone={getTripStatusTone(trip.status)}
                  />
                  {trip.status === "PENDING" ? (
                    <button
                      type="button"
                      onClick={() =>
                        void updateTripStatus.mutateAsync({
                          payload: { status: "IN_PROGRESS" },
                          tripId: trip.id,
                        })
                      }
                      disabled={updateTripStatus.isPending}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
                    >
                      Bắt đầu chuyến
                    </button>
                  ) : null}
                  {trip.status === "IN_PROGRESS" ? (
                    <button
                      type="button"
                      onClick={() =>
                        void updateTripStatus.mutateAsync({
                          payload: { status: "COMPLETED" },
                          tripId: trip.id,
                        })
                      }
                      disabled={updateTripStatus.isPending}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
                    >
                      Hoàn tất
                    </button>
                  ) : null}
                  <Link
                    href={`/dashboard/driver/trips/${trip.id}`}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Mở chi tiết
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
