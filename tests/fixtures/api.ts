import type { OrderDTO } from "@/features/orders/domain/types/order.types";

export const sampleOrder: OrderDTO = {
  id: "ord-001",
  reference: "ELG-2026-0001",
  customerName: "Công ty Logistics Xanh",
  pickupAddress: "123 Nguyễn Văn Linh, Quận 7",
  deliveryAddress: "456 Điện Biên Phủ, Bình Thạnh",
  estimatedArrival: "2026-04-20T10:00:00.000Z",
  co2SavedKg: 18.4,
  status: "IN_TRANSIT",
  contactName: "Lan",
  contactPhone: "0909000001",
  receiverName: "Minh",
  receiverPhone: "0909000002",
  packageWeightKg: 25,
  packageDimensions: "40x30x20",
  declaredValueUsd: 150,
  serviceTier: "eco_green",
  paymentMethod: "cash_on_delivery",
  itemDescription: "Thiết bị điện tử",
  pricing: {
    logisticsFee: 120,
    handlingFee: 20,
    ecoDiscount: 15,
    vat: 12.5,
    total: 137.5,
    currency: "USD",
  },
  stops: [],
};

export const sampleOrdersPage = {
  data: [sampleOrder],
  totalItems: 1,
};

export const emptyOrdersPage = {
  data: [],
  totalItems: 0,
};

export const sampleTrackingResponse = {
  trackingCode: sampleOrder.reference,
  currentStatus: "IN_TRANSIT",
  events: [
    {
      id: "evt-1",
      eventType: "STATUS_CHANGE",
      status: "PICKED_UP",
      location: "Quận 7",
      description: "Đã lấy hàng",
      createdAt: "2026-04-19T08:00:00.000Z",
    },
    {
      id: "evt-2",
      eventType: "STATUS_CHANGE",
      status: "IN_TRANSIT",
      location: "Bình Thạnh",
      description: "Đang trên đường giao",
      createdAt: "2026-04-19T10:00:00.000Z",
      pod: {
        receiverName: "Minh",
        packageCondition: "INTACT",
        images: [
          {
            url: "https://example.com/pod.png",
            type: "PACKAGE",
          },
        ],
      },
    },
  ],
};

export const sampleTrackingViewModel = {
  trackingCode: sampleTrackingResponse.trackingCode,
  currentStatus: sampleTrackingResponse.currentStatus,
  dataSource: "api",
  isDemo: false,
  podImageUrl: "https://example.com/pod.png",
  podPackageCondition: "INTACT",
  recipientName: "Minh",
  events: [
    {
      id: "evt-1",
      label: "Đã lấy hàng",
      location: "Quận 7",
      status: "completed",
      timestamp: "2026-04-19T08:00:00.000Z",
      description: "Đã lấy hàng",
    },
    {
      id: "evt-2",
      label: "Đang vận chuyển",
      location: "Bình Thạnh",
      status: "current",
      timestamp: "2026-04-19T10:00:00.000Z",
      description: "Đang trên đường giao",
    },
  ],
};

export const sampleAnalyticsMetrics = [
  {
    id: "total_orders",
    label: "Tổng đơn hàng",
    value: "1.284",
    trend: "positive",
    trendValue: "+12.5%",
  },
  {
    id: "total_revenue",
    label: "Tổng doanh thu",
    value: "₫500.000.000",
    trend: "positive",
    trendValue: "+15.2%",
  },
];

export const sampleFleetPerformance = [
  {
    id: "veh-1",
    vehicleInfo: "Xe 51A-12345",
    activeOrders: 12,
    onTimeRate: 94,
    co2Saved: 380,
  },
];

export const sampleVehicleList = {
  data: [
    {
      id: "veh-1",
      licensePlate: "51A-12345",
      type: "ELECTRIC_VAN",
      fuelType: "ELECTRIC",
      isActive: true,
    },
  ],
  totalItems: 1,
};

export const sampleNotificationsPage = {
  data: [
    {
      id: 12,
      title: "Cập nhật role request",
      content: "Yêu cầu của bạn đang chờ duyệt.",
      isRead: false,
      createdAt: "2026-04-20T09:00:00.000Z",
      payload: {
        roleRequestId: 12,
        targetRoleName: "DRIVER",
        status: "PENDING",
      },
    },
  ],
  totalItems: 1,
};

export const sampleRoleRequestsPage = {
  data: [
    {
      id: 88,
      targetRoleName: "WAREHOUSE_STAFF",
      status: "PENDING",
      reason: "Tôi muốn phụ trách xử lý hàng tại hub.",
      createdAt: "2026-04-20T09:00:00.000Z",
      user: {
        id: 7,
        fullName: "Nguyen Van B",
      },
    },
  ],
  totalItems: 1,
};
