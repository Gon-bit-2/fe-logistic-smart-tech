import type { ServiceTier } from "@/features/orders/domain/types/order.types";
import type { ShipmentFilter } from "@/features/orders/domain/types/shipments-management.types";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  ARRIVED_AT_HUB: "Đã tới trung tâm",
  ASSIGNED: "Đã phân công",
  CANCELLED: "Đã huỷ",
  DELIVERED: "Đã giao",
  IN_TRANSIT: "Đang vận chuyển",
  OUT_FOR_DELIVERY: "Đang giao hàng",
  PENDING: "Chờ xử lý",
  PICKED_UP: "Đã lấy hàng",
} as const;

export const ORDER_STOP_STATUS_LABELS: Record<string, string> = {
  completed: "Hoàn tất",
  current: "Đang diễn ra",
  pending: "Chờ xử lý",
} as const;

export function getOrderStatusLabel(value: string) {
  return ORDER_STATUS_LABELS[value] ?? value;
}

export function getOrderStopStatusLabel(value: string) {
  return ORDER_STOP_STATUS_LABELS[value] ?? value;
}

export const serviceTierOptions = [
  {
    accent: "tertiary",
    description: "Tuyến ưu tiên nhanh nhất với xử lý và điều phối gấp.",
    id: "express",
    label: "Giao hàng hoả tốc",
  },
  {
    accent: "primary",
    description: "Tuyến chia sẻ bền vững, tối ưu để giảm phát thải.",
    highlight: "CO2 thấp",
    id: "eco_green",
    label: "Chuyến ghép xanh",
  },
  {
    accent: "outline",
    description: "Tốc độ giao cân bằng cho nhu cầu hoàn tất tiêu chuẩn.",
    id: "standard",
    label: "Giao hàng tiêu chuẩn",
  },
] as const satisfies readonly {
  accent: "primary" | "tertiary" | "outline";
  description: string;
  highlight?: string;
  id: ServiceTier;
  label: string;
}[];

export const orderFormCopy = {
  contactName: "Tên liên hệ",
  contactPhone: "Số điện thoại liên hệ",
  createTitle: "Tạo đơn hàng mới",
  customer: "Khách hàng",
  declaredValue: "Giá trị khai báo",
  deliveryAddress: "Địa chỉ giao hàng",
  dimensions: "Kích thước (cm)",
  estimatedArrival: "Thời gian dự kiến đến",
  itemDescription: "Mô tả hàng hoá",
  localMockQuote: "Không dùng báo giá local",
  orderCreated: "Đơn hàng đã được tạo",
  ordersEyebrow: "Đơn hàng",
  pricingSourceDescription:
    "Báo giá, thuế và mức tiết kiệm xanh hiện lấy trực tiếp từ phản hồi của Orders API.",
  pricingSourceLabel: "Nguồn báo giá",
  receiverName: "Tên người nhận",
  receiverPhone: "Số điện thoại người nhận",
  selectServiceTier: "Chọn gói dịch vụ",
  stepLabels: ["Điểm đi/đến", "Chi tiết", "Dịch vụ"],
  submitLoading: "Đang gửi...",
  subtitle: "Thiết lập tuyến đường, hồ sơ kiện hàng và gói dịch vụ.",
  totalQuoted: "tổng báo giá",
  weight: "Khối lượng (kg)",
  pickupAddress: "Địa chỉ lấy hàng",
} as const;

export const serviceTierSelectorCopy = {
  apiQuote: "Báo giá API",
} as const;

export const routePreviewCopy = {
  declaredValue: "Giá trị khai báo",
  delivery: "Điểm giao",
  deliveryMissing: "Chưa thiết lập điểm giao",
  dimensions: "Kích thước",
  draftSummary: "Tóm tắt bản nháp",
  eta: "ETA",
  newShipment: "Lô hàng mới",
  pending: "Đang chờ",
  pendingQuote: "Chờ báo giá",
  pickup: "Điểm lấy",
  pickupMissing: "Chưa thiết lập điểm lấy",
  pricingSourceDescription:
    "Không còn dùng báo giá local. Phí logistics cuối cùng và các chỉ số xanh phải đến từ phản hồi backend của đơn hàng.",
  pricingSourceLabel: "Nguồn báo giá",
  routePreview: "Xem trước tuyến đường",
  service: "Dịch vụ",
  weight: "Khối lượng",
} as const;

export const checkoutCopy = {
  awaitingQuote: "Đang chờ báo giá",
  cardNumber: "Số thẻ",
  cardNumberPlaceholder: "0000 0000 0000 0000",
  cardPayment: "Thanh toán bằng thẻ",
  cardPaymentDescription:
    "Thanh toán an toàn ngay bây giờ để lô hàng được giải phóng tức thì.",
  cashOnDelivery: "Thanh toán khi nhận hàng",
  cashOnDeliveryDescription:
    "Thanh toán khi kiện hàng đến điểm nhận cuối cùng.",
  checkoutErrorEyebrow: "Lỗi thanh toán",
  checkoutErrorTitle: "Không có đơn hàng khả dụng để thanh toán",
  confirmCodOrder: "Xác nhận đơn COD",
  cvc: "CVC",
  cvcPlaceholder: "123",
  ecoDiscount: "Ưu đãi dịch vụ xanh",
  emptyOrderDescription:
    "Mở trang thanh toán từ luồng tạo đơn hàng hoặc cung cấp `orderId` hợp lệ trong URL.",
  expiryDate: "Ngày hết hạn",
  expiryPlaceholder: "MM / YY",
  insuranceDescription:
    "Mọi lô hàng đều được bảo hiểm tối đa 500,00 USD cho hư hại hoặc mất mát trong quá trình vận chuyển.",
  insuranceTitle: "Đã bao gồm bảo hiểm",
  loadOrder: "Đang tải đơn hàng để thanh toán...",
  logisticsFee: "Phí logistics",
  orderSummary: "Tóm tắt đơn hàng",
  payAndConfirmOrder: "Thanh toán và xác nhận đơn",
  paymentDetails: "Chi tiết thanh toán",
  pendingApiQuote: "Đang chờ báo giá từ API",
  pricingDescription:
    "Giá hiện không còn được tạo từ dữ liệu mock local. Backend phải trả về báo giá trước khi đơn hàng có thể hoàn tất thanh toán.",
  processing: "Đang xử lý...",
  shippingAndHandling: "Phí vận chuyển và xử lý",
  sustainableChoice: "Lựa chọn bền vững",
  sustainabilityMissing:
    "Mức tiết kiệm CO2 sẽ hiển thị tại đây khi phản hồi backend của đơn hàng bao gồm các chỉ số bền vững.",
  sustainabilityValue: (value: number) =>
    `Lô hàng này ghi nhận tiết kiệm ${value}kg CO2 từ phản hồi backend của đơn hàng.`,
  title: "Thanh toán",
  totalAmount: "Tổng thanh toán",
  vat: "VAT",
  orderSubtitle: (reference: string) =>
    `Hoàn tất lô hàng ${reference} và xác nhận lịch trình giao nhận của bạn.`,
} as const;

export const orderCreationWorkspaceCopy = {
  ctaLabel: "Tạo đơn hàng và tiếp tục",
} as const;

export const orderTimelineCopy = {
  eyebrow: "Theo dõi",
} as const;

export const orderStatusFilters = ["Tất cả", "Chờ xử lý", "Đang vận chuyển", "Đã giao"] as const;
export const orderServiceTierFilters = ["Xanh", "Hoả tốc", "Tiêu chuẩn"] as const;

export const orderManagementCopy = {
  actions: "Thao tác",
  customer: "Khách hàng",
  date: "Ngày",
  description: "1.284 lô hàng đang hoạt động trên các tuyến vận hành toàn cầu",
  ecoImpact: "Tác động xanh",
  exportData: "Xuất dữ liệu",
  exportSnapshot: "Xuất ảnh chụp dữ liệu",
  logisticsStatus: "Trạng thái vận hành",
  orderId: "Mã đơn hàng",
  pageSummary: "Trang 1 / 64",
  priority: "Mức ưu tiên",
  recentReduction: "Giảm 8% so với tháng trước",
  refineView: "Tinh chỉnh góc nhìn hệ sinh thái",
  route: "Tuyến đường",
  serviceTier: "Gói dịch vụ",
  showing: "Hiển thị 100 / 1.284 đơn hàng",
  status: "Trạng thái",
  title: "Quản lý đơn hàng",
} as const;

export const shipmentFilters: ReadonlyArray<ShipmentFilter> = [
  { label: "Tất cả lô hàng" },
  { label: "Đang hoạt động" },
  { label: "Bị trễ" },
];

export const shipmentsManagementCopy = {
  activeShipmentsSummary: (visibleCount: number, totalCount: number) =>
    `Hiển thị ${visibleCount} / ${totalCount} lô hàng từ Orders API`,
  addShipment: "Thêm lô hàng",
  carbonReport: "Xem báo cáo carbon",
  ecoImpactDescription: "Bạn đã bù đắp 12,4 tấn CO2 trong tuần này.",
  ecoImpactTitle: "Điểm tác động xanh",
  filterPlaceholder: "Lọc theo mã, xe hoặc tuyến...",
  headings: ["Mã theo dõi", "Tuyến đường", "Mã xe", "Trạng thái", "ETA", ""],
  listEmptyDescription:
    "Orders API chưa trả về lô hàng nào khớp với bộ lọc hiện tại.",
  listEmptyTitle: "Chưa có lô hàng để hiển thị",
  listErrorDescription:
    "Không thể tải danh sách lô hàng từ backend. Hãy kiểm tra quyền truy cập hoặc kết nối API.",
  listErrorTitle: "Không tải được dữ liệu lô hàng",
  listLoadingDescription:
    "Đang tải lô hàng từ Orders API để thay thế bảng điều phối hard-code trước đây.",
  listLoadingTitle: "Đang tải lô hàng",
  liveMapButton: "Mở bản đồ toàn màn hình",
  liveMapEyebrow: "Bản đồ mạng lưới trực tiếp",
  mapPendingDescription:
    "Bản đồ trực tiếp cần dữ liệu trip hoặc route thật từ backend. Khi chưa có contract phù hợp, phần này sẽ không dựng dữ liệu mô phỏng.",
  mapPendingTitle: "Bản đồ điều phối đang chờ tích hợp",
  networkEfficiency: "Hiệu suất mạng lưới",
  networkEfficiencyDetail: "Các tuyến tối ưu carbon đang hoạt động",
  summaryLabels: {
    delivered: "Đã giao",
    inTransit: "Đang vận chuyển",
    total: "Tổng lô hàng",
  },
  subtitle: "Giám sát thời gian thực cho mạng lưới phân phối chính xác.",
  title: "Quản lý lô hàng",
  vehiclePending: "Đang chờ phân xe",
} as const;
