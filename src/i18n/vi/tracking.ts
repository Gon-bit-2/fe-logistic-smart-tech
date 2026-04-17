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
  apiDrivenEyebrow: "Kết nối API",
  apiDrivenDescription:
    "Luồng theo dõi không còn dùng dữ liệu demo. Hãy cung cấp mã theo dõi thực do Orders API hoặc Tracking API trả về.",
  apiDrivenTitle: "Theo dõi hiện yêu cầu dữ liệu backend trực tiếp",
  inputPlaceholder: "Nhập mã theo dõi",
  title: "Theo dõi hành trình đơn hàng",
  trackButton: "Theo dõi đơn hàng",
} as const;

export const trackingDetailCopy = {
  currentStatusHint: "Dòng thời gian công khai trực tiếp",
  errorEyebrow: "Lỗi theo dõi",
  errorTitle: "Không thể tải dòng thời gian lô hàng",
  fallbackError: "Hiện không thể truy xuất dữ liệu theo dõi trực tiếp.",
  helpCenter: "Trung tâm hỗ trợ",
  helpText: "Cần trợ giúp? Truy cập",
  loadingDescription:
    "Chúng tôi đang lấy dòng thời gian lô hàng công khai mới nhất từ Logistics API.",
  loadingEyebrow: "Đang tải",
  loadingTitle: "Đang tải các sự kiện theo dõi mới nhất",
  notFoundEyebrow: "Không tìm thấy",
  notFoundTitle: "Không tìm thấy lô hàng công khai với mã theo dõi này",
  printLabels: "In nhãn",
  receiverHint: "Dữ liệu theo dõi công khai ẩn các trường nội bộ nhạy cảm.",
  receiverLabel: "Người nhận",
  retry: "Thử lại",
  searchAnother: "Tìm lô hàng khác",
  shareTracking: "Chia sẻ theo dõi",
  supportSuffix: "hoặc liên hệ hỗ trợ 24/7.",
  trackingCodeLabel: "Mã theo dõi",
} as const;

export const internalTrackingCopy = {
  accessErrorEyebrow: "Lỗi truy cập",
  accessErrorTitle: "Bạn không có quyền xem dòng thời gian nội bộ của đơn hàng này",
  connectHint: "Kết nối một `orderId` để xem dòng thời gian lô hàng nội bộ.",
  currentStatusLabel: "Trạng thái hiện tại",
  dataSourceLabel: "Nguồn dữ liệu",
  dataSourceValue: "API nội bộ",
  driverEyebrow: "Tài xế",
  fallbackError: "Hiện không thể tải dữ liệu theo dõi nội bộ.",
  loadingDescription: "Đang tải dòng thời gian theo dõi được bảo vệ từ Logistics API.",
  loadingEyebrow: "Đang tải",
  loadingTitle: "Đang tải các sự kiện nội bộ của lô hàng",
  missingOrderDescription:
    "Hãy cung cấp `orderId` trong URL dashboard để tải dòng thời gian nội bộ được bảo vệ. Không gian làm việc này không còn dùng dữ liệu demo.",
  title: "Không gian thực thi tuyến đường",
  trackingCodeLabel: "Mã theo dõi",
  trackingErrorEyebrow: "Lỗi theo dõi",
  trackingErrorTitle: "Không thể tải dòng thời gian nội bộ của lô hàng",
  viewLiveTracking: (trackingCode: string) =>
    `Đang xem theo dõi nội bộ trực tiếp cho ${trackingCode}.`,
} as const;
