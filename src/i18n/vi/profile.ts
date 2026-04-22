export const profileScreenCopy = {
  title: "Hồ sơ & cài đặt",
  description:
    "Quản lý thông tin tài khoản, danh bạ địa chỉ và các cài đặt vận hành cá nhân.",
  tabs: {
    account: "Tài khoản",
    addressBook: "Danh bạ địa chỉ",
    access: "Quyền & thông báo",
    security: "Bảo mật",
  },
  account: {
    cardTitle: "Hồ sơ vận hành",
    cardDescription:
      "Thông tin này được dùng để hiển thị trong dashboard và các luồng phối hợp vận hành.",
    profileId: "Mã người dùng",
    role: "Vai trò",
    hubId: "Mã hub",
    syncReady: "Đã đồng bộ",
    syncPending: "Có thay đổi chưa lưu",
    syncDescription:
      "Thông tin tài khoản được cập nhật trực tiếp lên hồ sơ người dùng hiện tại qua API bảo mật.",
    fullNameLabel: "Họ và tên / tên doanh nghiệp",
    fullNamePlaceholder: "Công ty Emerald Logistics",
    phoneLabel: "Số điện thoại liên hệ",
    phonePlaceholder: "0900 111 222",
    emailLabel: "Email đăng nhập",
    emailHint: "Email hiện chưa thể thay đổi trực tiếp từ giao diện profile.",
    save: "Lưu thay đổi",
    savePending: "Đang lưu...",
    reset: "Khôi phục dữ liệu gốc",
    savedState: "Thông tin hồ sơ đã được cập nhật thành công.",
    dirtyState: "Bạn có thay đổi chưa được lưu.",
    cleanState: "Thông tin cá nhân đang khớp với dữ liệu máy chủ gần nhất.",
    validationName: "Vui lòng nhập tên hiển thị hợp lệ.",
    validationPhone: "Số điện thoại chỉ nên gồm 9-15 chữ số.",
  },
  addressBook: {
    title: "Danh bạ địa chỉ",
    description:
      "Lưu các điểm lấy và giao hàng thường dùng để tạo đơn nhanh hơn trong các lần sau.",
    add: "Thêm địa chỉ",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    setDefault: "Đặt mặc định",
    defaultBadge: "Mặc định",
    emptyTitle: "Chưa có địa chỉ nào",
    emptyDescription:
      "Tạo điểm giao nhận đầu tiên để chuẩn hóa thông tin liên hệ và thao tác tạo đơn.",
    dialogCreateTitle: "Thêm địa chỉ mới",
    dialogEditTitle: "Cập nhật địa chỉ",
    dialogDescription:
      "Thông tin sẽ được lưu trực tiếp vào sổ địa chỉ cá nhân của tài khoản hiện tại.",
    save: "Lưu địa chỉ",
    create: "Tạo địa chỉ",
    cancel: "Hủy",
    fields: {
      label: "Tên địa chỉ",
      contactName: "Người liên hệ",
      phone: "Số điện thoại",
      addressLine: "Địa chỉ chi tiết",
      setAsDefault: "Đặt làm địa chỉ mặc định",
    },
    placeholders: {
      label: "Kho chính Quận 7",
      contactName: "Nguyễn Văn A",
      phone: "0911 223 344",
      addressLine: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    },
    validation: {
      label: "Tên địa chỉ là bắt buộc.",
      contactName: "Vui lòng nhập tên người liên hệ.",
      phone: "Số điện thoại địa chỉ không hợp lệ.",
      addressLine: "Vui lòng nhập địa chỉ chi tiết.",
    },
    loading: "Đang tải sổ địa chỉ...",
    loadError: "Không thể tải danh bạ địa chỉ lúc này.",
  },
  access: {
    title: "Điều phối tài khoản",
    description:
      "Theo dõi thông báo hệ thống và các yêu cầu vai trò ngay trong không gian khách hàng.",
    notificationsTitle: "Notification inbox",
    notificationsDescription:
      "Mở inbox để xem thông báo phê duyệt, nhắc việc và cập nhật vận hành.",
    notificationsCta: "Mở inbox",
    rolesTitle: "Role requests",
    rolesDescription:
      "Theo dõi hoặc gửi yêu cầu trở thành tài xế hay nhân viên kho từ dashboard.",
    rolesCta: "Mở role center",
  },
  security: {
    title: "Bảo mật & đăng nhập",
    description:
      "Quản lý kênh đăng nhập chính và chuyển sang luồng đặt lại mật khẩu khi cần.",
    emailTitle: "Email đăng nhập",
    emailDescription:
      "Đây là định danh đăng nhập chính của tài khoản hiện tại và chưa hỗ trợ đổi trực tiếp.",
    resetTitle: "Đổi mật khẩu",
    resetDescription:
      "Sử dụng luồng quên mật khẩu để nhận OTP và đặt lại mật khẩu an toàn.",
    resetCta: "Mở luồng bảo mật",
  },
  loadErrorUnauthorized: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  loadErrorForbidden: "Bạn không có quyền truy cập hồ sơ này.",
  loadErrorFallback: "Không thể tải thông tin hồ sơ lúc này.",
} as const;
