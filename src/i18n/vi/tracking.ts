const fallbackTrackingLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export const TRACKING_STATUS_LABELS: Record<string, string> = {
  ARRIVED_AT_HUB: "Đã đến trung tâm trung chuyển",
  ASSIGNED: "Đã phân công",
  CANCELLED: "Đã huỷ",
  DELIVERED: "Đã giao",
  IN_TRANSIT: "Đang vận chuyển",
  OUT_FOR_DELIVERY: "Đang giao hàng",
  PENDING: "Chờ xử lý",
  PICKED_UP: "Đã lấy hàng",
};

export const TRACKING_EVENT_LABELS: Record<string, string> = {
  ETA_UPDATE: "Cập nhật ETA",
  EXCEPTION: "Sự cố",
  NOTE: "Ghi chú vận hành",
  POD: "Biên nhận giao hàng",
  SCAN: "Quét kiện hàng",
  STATUS_CHANGE: "Cập nhật trạng thái",
};

export const TRACKING_STEP_STATUS_LABELS: Record<string, string> = {
  completed: "Hoàn tất",
  current: "Hiện tại",
  pending: "Chờ xử lý",
};

export function getTrackingStatusLabel(value: string) {
  return TRACKING_STATUS_LABELS[value] ?? fallbackTrackingLabel(value);
}

export function getTrackingEventLabel(value: string) {
  return TRACKING_EVENT_LABELS[value] ?? TRACKING_STATUS_LABELS[value] ?? fallbackTrackingLabel(value);
}

export function getTrackingStepStatusLabel(value: string) {
  return TRACKING_STEP_STATUS_LABELS[value] ?? fallbackTrackingLabel(value);
}

export const proofOfDeliveryCopy = {
  fallbackCondition: "Cần chữ ký điện tử",
  imageAlt: "Biên nhận giao hàng",
  pendingCapture: "Chờ ghi nhận",
  pendingImageAlt: "Biên nhận giao hàng đang chờ cập nhật",
  pendingRecipient: "Đang chờ xác nhận người nhận",
  recipientLabel: "Người nhận",
  title: "Biên nhận giao hàng",
  trackingCodeLabel: "Mã theo dõi",
  eyebrow: "POD",
} as const;

export const trackingTimelineCopy = {
  currentStepHint: "Đang xử lý cho chặng giao hàng tiếp theo.",
  eyebrow: "Theo dõi trực tiếp",
  title: "Các cột mốc lô hàng",
} as const;

export const trackingLookupCopy = {
  apiDrivenEyebrow: "Kết nối hệ thống",
  apiDrivenDescription:
    "Hệ thống đang sử dụng dữ liệu trực tuyến. Vui lòng nhập mã theo dõi chính thức từ hệ thống vận hành.",
  apiDrivenTitle: "Tra cứu đơn hàng trực tuyến",
  inputPlaceholder: "Nhập mã theo dõi",
  title: "Theo dõi hành trình đơn hàng",
  trackButton: "Theo dõi đơn hàng",
} as const;

export const trackingDetailCopy = {
  cancelConfirm: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
  cancelError: "Không thể hủy đơn hàng vào lúc này.",
  cancelOrder: "Hủy đơn",
  cancelSuccess: "Đơn hàng đã được hủy thành công.",
  cancelling: "Đang hủy...",
  copySuccess: "Đã sao chép liên kết theo dõi.",
  customerActionsDescription:
    "Bạn có thể tiếp tục thanh toán, hủy đơn ở giai đoạn sớm hoặc chia sẻ liên kết theo dõi.",
  customerActionsEyebrow: "Thao tác khách hàng",
  currentStatusHint: "Hành trình đơn hàng công khai",
  errorEyebrow: "Lỗi theo dõi",
  errorTitle: "Không thể tải dữ liệu hành trình lô hàng",
  fallbackError: "Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau.",
  helpCenter: "Trung tâm hỗ trợ",
  helpText: "Cần trợ giúp? Truy cập",
  loadingDescription:
    "Hệ thống đang đồng bộ dữ liệu hành trình mới nhất.",
  loadingEyebrow: "Đang tải",
  loadingTitle: "Đang tải dữ liệu hành trình mới nhất",
  notFoundEyebrow: "Không tìm thấy",
  notFoundTitle: "Không tìm thấy lô hàng công khai với mã theo dõi này",
  printLabels: "In nhãn",
  paymentPendingDescription:
    "Đơn hàng này đang chờ thanh toán trực tuyến. Hoàn tất thanh toán để kích hoạt luồng xử lý tiếp theo.",
  paymentPendingEyebrow: "Thanh toán",
  paymentPendingTitle: "Đơn hàng đang chờ thanh toán",
  payNow: "Thanh toán ngay",
  receiverHint: "Một số thông tin nhạy cảm đã được ẩn để bảo mật.",
  receiverLabel: "Người nhận",
  retry: "Thử lại",
  searchAnother: "Tìm lô hàng khác",
  shareSuccess: "Đã mở luồng chia sẻ mã theo dõi.",
  shareText: (trackingCode: string) =>
    `Theo dõi đơn hàng ${trackingCode} tại liên kết này.`,
  shareTracking: "Chia sẻ theo dõi",
  shareTitle: "Chia sẻ mã theo dõi",
  shareUnavailable: "Không thể chia sẻ liên kết theo dõi trên thiết bị hiện tại.",
  supportSuffix: "hoặc liên hệ hỗ trợ 24/7.",
  trackingCodeLabel: "Mã theo dõi",
} as const;

export const internalTrackingCopy = {
  accessErrorEyebrow: "Lỗi truy cập",
  accessErrorTitle: "Bạn không có quyền xem dòng thời gian nội bộ của đơn hàng này",
  connectHint: "Vui lòng cung cấp mã đơn hàng (Order ID) để xem chi tiết hành trình vận chuyển nội bộ.",
  currentStatusLabel: "Trạng thái hiện tại",
  dataSourceLabel: "Nguồn dữ liệu",
  dataSourceValue: "API nội bộ",
  driverEyebrow: "Tài xế",
  fallbackError: "Hệ thống đang tạm thời gián đoạn. Không thể truy xuất dữ liệu vận hành.",
  loadingDescription: "Đang đồng bộ dữ liệu vận hành nội bộ.",
  loadingEyebrow: "Đang tải",
  loadingTitle: "Đang tải dữ liệu hành trình nội bộ",
  missingOrderDescription:
    "Vui lòng truy cập thông qua hệ thống quản lý để xem chi tiết hành trình vận chuyển nội bộ.",
  title: "Không gian thực thi tuyến đường",
  trackingCodeLabel: "Mã theo dõi",
  trackingErrorEyebrow: "Lỗi theo dõi",
  trackingErrorTitle: "Không thể tải dòng thời gian nội bộ của lô hàng",
  viewLiveTracking: (trackingCode: string) =>
    `Đang xem theo dõi nội bộ trực tiếp cho ${trackingCode}.`,
} as const;
