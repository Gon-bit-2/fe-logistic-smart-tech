export const walletScreenCopy = {
  actions: {
    openTrips: "Mở chuyến đi",
    openVehicle: "Xem phương tiện",
    reconcile: "Đối soát COD",
    refresh: "Làm mới",
    retry: "Tải lại",
  },
  driver: {
    codDescription:
      "Số COD đang giữ được cập nhật khi tài xế xác nhận đã thu tiền mặt ở đơn COD. Kho hoặc admin sẽ đối soát khoản này sau khi bàn giao tiền.",
    codTitle: "Theo dõi tiền COD đang giữ",
    description:
      "Kiểm tra số dư ví, khoản COD chưa đối soát và mở nhanh các luồng chuyến đi liên quan.",
    errorTitle: "Không tải được ví tài xế",
    eyebrow: "Driver wallet",
    lastUpdated: "Cập nhật lần cuối",
    loadingDescription: "Đang đồng bộ ví và số dư COD...",
    loadingTitle: "Đang tải ví tài xế",
    title: "Ví & COD tài xế",
  },
  fields: {
    amount: "Số tiền COD",
    description: "Ghi chú đối soát",
    driverId: "ID tài xế",
    referenceId: "Mã biên nhận",
  },
  metrics: {
    balance: "Số dư ví",
    codCollected: "COD đang giữ",
    status: "Trạng thái ví",
  },
  reconciliation: {
    description:
      "Ghi nhận khoản COD tài xế đã bàn giao về kho hoặc bộ phận tài chính. Giao dịch sẽ giảm số COD đang giữ của tài xế.",
    eyebrow: "COD reconciliation",
    previewDescription:
      "Kiểm tra số tiền và mã biên nhận trước khi xác nhận. Hệ thống sẽ từ chối nếu số tiền lớn hơn COD đang giữ.",
    previewEyebrow: "Số tiền đối soát",
    successMessage: "Đã ghi nhận đối soát COD thành công.",
    title: "Đối soát COD",
  },
} as const;
