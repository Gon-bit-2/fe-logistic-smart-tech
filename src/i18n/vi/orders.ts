import type { OrderPaymentMethod, ServiceTier } from "@/features/orders/domain/types/order.types";
import type { ShipmentFilter } from "@/features/orders/domain/types/shipments-management.types";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  ARRIVED_AT_HUB: "Đã nhập kho",
  ASSIGNED: "Đã xếp chuyến",
  CANCELLED: "Đã huỷ",
  DELIVERED: "Giao thành công",
  IN_TRANSIT: "Đang trung chuyển",
  OUT_FOR_DELIVERY: "Đang đi giao",
  PENDING: "Chờ xác nhận",
  PICKED_UP: "Đã nhận hàng",
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
    description: "Dịch vụ vận chuyển nhanh với mức ưu tiên cao nhất, đảm bảo xử lý và điều phối tức thì.",
    id: "express",
    label: "Giao hàng hoả tốc",
  },
  {
    accent: "primary",
    description: "Giải pháp giao hàng ghép chuyến, tối ưu hóa lộ trình nhằm giảm thiểu khí thải carbon.",
    highlight: "Ít phát thải CO2",
    id: "eco_green",
    label: "Chuyến ghép xanh",
  },
  {
    accent: "outline",
    description: "Dịch vụ vận chuyển tiêu chuẩn với chi phí hợp lý, đáp ứng nhu cầu giao hàng thông thường.",
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
  addressAutocompleteEmpty: "Không tìm thấy gợi ý phù hợp.",
  addressAutocompleteHint: "Nhập tối thiểu 2 ký tự và chọn một địa chỉ từ danh sách gợi ý.",
  addressAutocompleteLoading: "Đang tìm địa chỉ...",
  addressAutocompleteRequired: "Vui lòng chọn một địa chỉ từ gợi ý.",
  addressAutocompleteSuggestion: "Địa chỉ gợi ý",
  addressSelected: "Đã chốt tọa độ",
  contactName: "Tên liên hệ",
  contactPhone: "Số điện thoại liên hệ",
  createTitle: "Tạo đơn hàng mới",
  customer: "Khách hàng",
  declaredValue: "Giá trị khai báo",
  deliveryAddress: "Địa chỉ giao hàng",
  dimensions: "Kích thước (cm)",
  dimensionsHint: "Nhập theo dạng Dài x Rộng x Cao. Ví dụ: 40x30x20 hoặc 40 × 30 × 20 cm.",
  dimensionsInvalid: "Kích thước kiện hàng không hợp lệ. Ví dụ: 40x30x20 cm.",
  dimensionsPlaceholder: "Ví dụ: 40x30x20",
  dimensionsRequired: "Vui lòng nhập kích thước kiện hàng.",
  estimatedArrival: "Thời gian dự kiến đến",
  itemDescription: "Mô tả hàng hoá",
  localMockQuote: "Chờ lấy báo giá từ hệ thống",
  orderCreated: "Đơn hàng đã được tạo",
  ordersEyebrow: "Đơn hàng",
  paymentMethod: "Phương thức thanh toán",
  pricingSourceDescription:
    "Chi phí vận chuyển, các loại thuế phí và mức tiết kiệm carbon được tính toán tự động từ hệ thống.",
  pricingSourceLabel: "Nguồn báo giá",
  receiverName: "Tên người nhận",
  receiverPhone: "Số điện thoại người nhận",
  resolvingAddress: "Đang lấy tọa độ...",
  selectServiceTier: "Chọn gói dịch vụ",
  selectPaymentMethod: "Chọn phương thức thanh toán",
  stepLabels: ["Điểm đi/đến", "Chi tiết", "Dịch vụ"],
  submitDisabledAddress: "Chọn đủ địa chỉ từ autocomplete để tiếp tục.",
  submitDisabledQuote: "Hệ thống cần báo giá thành công trước khi tạo đơn.",
  submitLoading: "Đang xử lý...",
  subtitle: "Thiết lập tuyến đường, hồ sơ kiện hàng và gói dịch vụ.",
  totalQuoted: "tổng báo giá",
  weight: "Khối lượng (kg)",
  pickupAddress: "Địa chỉ lấy hàng",
} as const;

export const paymentMethodOptions = [
  {
    description: "Thanh toán trực tuyến ngay sau khi tạo đơn để đưa lô hàng vào luồng xử lý nhanh.",
    id: "STRIPE",
    label: "Thanh toán trực tuyến",
  },
  {
    description: "Tài xế thu tiền mặt khi giao thành công và hệ thống sẽ đối soát COD nội bộ.",
    id: "COD",
    label: "COD khi nhận hàng",
  },
] as const satisfies readonly {
  description: string;
  id: OrderPaymentMethod;
  label: string;
}[];

export const serviceTierSelectorCopy = {
  apiQuote: "Báo giá tự động",
} as const;

export const routePreviewCopy = {
  distance: "Khoảng cách",
  declaredValue: "Giá trị khai báo",
  delivery: "Điểm giao",
  deliveryMissing: "Chưa thiết lập điểm giao",
  dimensions: "Kích thước",
  draftSummary: "Tóm tắt bản nháp",
  duration: "Thời lượng",
  eta: "ETA",
  mapLoadingDescription: "Đang đồng bộ tuyến đường thật từ hệ thống bản đồ.",
  mapMarkerOnlyDescription: "Đã chốt địa chỉ. Bản đồ đang hiển thị các điểm dừng thực tế.",
  mapPendingDescription:
    "Bản đồ thật sẽ hiển thị sau khi bạn chốt đủ địa chỉ và khối lượng hàng.",
  newShipment: "Lô hàng mới",
  pending: "Đang chờ",
  pendingQuote: "Chờ báo giá",
  quoteError: "Không lấy được báo giá",
  quotePendingDescription:
    "Bản đồ tuyến đường thật sẽ xuất hiện sau khi bạn chốt đủ địa chỉ và khối lượng hàng.",
  quoteReady: "Đã nhận báo giá",
  pickup: "Điểm lấy",
  pickupMissing: "Chưa thiết lập điểm lấy",
  pricingSourceDescription:
    "Hệ thống sẽ cập nhật chi phí vận chuyển chính xác và các chỉ số bảo vệ môi trường sau khi phân tích xong lộ trình.",
  pricingSourceLabel: "Nguồn báo giá",
  routePreview: "Xem trước tuyến đường",
  service: "Dịch vụ",
  shippingFee: "Cước vận chuyển",
  weight: "Khối lượng",
} as const;

export const checkoutCopy = {
  awaitingQuote: "Đang chờ báo giá",
  cardNumber: "Số thẻ",
  cardNumberPlaceholder: "0000 0000 0000 0000",
  cardPayment: "Thanh toán bằng thẻ",
  cardPaymentDescription:
    "Thanh toán an toàn ngay bây giờ để lô hàng được giải phóng tức thì.",
  codTrackingCta: "Theo dõi đơn hàng",
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
    "Không tìm thấy đơn hàng cần thanh toán. Vui lòng thử lại từ màn hình quản lý đơn.",
  expiryDate: "Ngày hết hạn",
  expiryPlaceholder: "MM / YY",
  insuranceDescription:
    "Mọi lô hàng đều được bảo hiểm tối đa 500,00 USD cho hư hại hoặc mất mát trong quá trình vận chuyển.",
  insuranceTitle: "Đã bao gồm bảo hiểm",
  loadOrder: "Đang tải đơn hàng để thanh toán...",
  logisticsFee: "Phí vận chuyển",
  orderSummary: "Tóm tắt đơn hàng",
  payAndConfirmOrder: "Thanh toán và xác nhận đơn",
  paymentDetails: "Chi tiết thanh toán",
  pendingApiQuote: "Đang chờ báo giá từ hệ thống",
  pricingDescription:
    "Hệ thống đang tiến hành lấy báo giá chính thức. Vui lòng chờ trong giây lát.",
  processing: "Đang xử lý...",
  redirectToCodTracking:
    "Đơn hàng này dùng COD. Theo dõi tiến trình giao nhận và thu hộ từ màn hình theo dõi.",
  shippingAndHandling: "Phí xử lý",
  sustainableChoice: "Lựa chọn bền vững",
  sustainabilityMissing:
    "Mức tiết kiệm CO2 cho lô hàng này sẽ được hiển thị sau khi hệ thống xử lý hoàn tất dữ liệu môi trường.",
  sustainabilityValue: (value: number) =>
    `Đơn hàng này giúp giảm thiểu ${value}kg lượng CO2 phát thải vào môi trường.`,
  title: "Thanh toán",
  totalAmount: "Tổng thanh toán",
  vat: "Thuế VAT",
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
  logisticsStatus: "Trạng thái giao nhận",
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
    `Hiển thị ${visibleCount} / ${totalCount} lô hàng phù hợp`,
  addShipment: "Thêm lô hàng",
  carbonReport: "Xem báo cáo carbon",
  ecoImpactDescription: "Bạn đã bù đắp 12,4 tấn CO2 trong tuần này.",
  ecoImpactTitle: "Điểm tác động xanh",
  filterPlaceholder: "Lọc theo mã, xe hoặc tuyến...",
  headings: ["Mã theo dõi", "Tuyến đường", "Mã xe", "Trạng thái", "ETA", "Hành động"],
  listEmptyDescription:
    "Không tìm thấy lô hàng nào phù hợp với điều kiện tìm kiếm.",
  listEmptyTitle: "Chưa có lô hàng để hiển thị",
  listErrorDescription:
    "Lỗi khi tải danh sách lô hàng. Vui lòng kiểm tra lại kết nối hoặc thử lại sau.",
  listErrorTitle: "Không tải được dữ liệu lô hàng",
  listLoadingDescription:
    "Đang tải danh sách lô hàng...",
  listLoadingTitle: "Đang tải lô hàng",
  liveMapButton: "Mở bản đồ toàn màn hình",
  liveMapEyebrow: "Bản đồ mạng lưới trực tuyến",
  mapPendingDescription:
    "Bản đồ điều phối theo thời gian thực sẽ hiển thị sau khi hệ thống nhận được dữ liệu lộ trình chính thức.",
  mapPendingTitle: "Bản đồ điều phối đang chờ kết nối",
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
