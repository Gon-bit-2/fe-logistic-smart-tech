export type ErrorExperienceAction = {
  label: string;
  href?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
};

export type ErrorExperienceContent = {
  code: string;
  checklist: string[];
  description: string;
  eyebrow: string;
  insights: Array<{
    label: string;
    value: string;
  }>;
  links: ErrorExperienceAction[];
  primaryAction: ErrorExperienceAction;
  secondaryAction?: ErrorExperienceAction;
  title: string;
  tone: "emerald" | "amber" | "rose" | "sky";
};

function normalizeMessage(message?: string) {
  return message?.trim() || "";
}

function toReference(digest?: string) {
  return digest ? `#${digest}` : "Không có";
}

function isConfigurationError(message: string) {
  return /cấu hình|configuration|env|api chưa được cấu hình/i.test(message);
}

function isNetworkError(message: string) {
  return /fetch|network|timeout|timed out|econn|không thể tải|kết nối/i.test(message);
}

function isMissingResourceError(message: string) {
  return /không tìm thấy|not found|missing/i.test(message);
}

export function getGlobalErrorContent(error: Error & { digest?: string }): ErrorExperienceContent {
  const message = normalizeMessage(error.message);
  const reference = toReference(error.digest);

  if (isConfigurationError(message)) {
    return {
      code: "503",
      checklist: [
        "Kiểm tra biến môi trường và endpoint API trước khi deploy.",
        "Thử lại sau khi backend hoặc cấu hình dịch vụ đã sẵn sàng.",
        "Nếu lỗi kéo dài, dùng mã tham chiếu để chuyển cho đội kỹ thuật.",
      ],
      description:
        "Một dịch vụ nền hoặc cấu hình môi trường chưa sẵn sàng, nên trang hiện chưa thể phản hồi ổn định.",
      eyebrow: "Configuration issue",
      insights: [
        { label: "Nhóm lỗi", value: "Cấu hình hoặc tích hợp" },
        { label: "Tác động", value: "Các tính năng phụ thuộc API có thể không hoạt động" },
        { label: "Mã tham chiếu", value: reference },
      ],
      links: [
        { href: "/", label: "Về landing page", variant: "ghost" },
        { href: "/auth/login", label: "Đến đăng nhập", variant: "ghost" },
      ],
      primaryAction: { label: "Quay về trang chủ", href: "/" },
      secondaryAction: { label: "Đăng nhập hệ thống", href: "/auth/login", variant: "outline" },
      title: "Hệ thống chưa sẵn sàng để phục vụ yêu cầu này",
      tone: "amber",
    };
  }

  if (isNetworkError(message)) {
    return {
      code: "502",
      checklist: [
        "Thử tải lại sau vài giây để khôi phục kết nối đến dịch vụ nền.",
        "Kiểm tra mạng nội bộ hoặc trạng thái backend nếu bạn đang vận hành hệ thống.",
        "Sử dụng một đường dẫn khác nếu bạn cần tiếp tục thao tác ngay.",
      ],
      description:
        "Ứng dụng đang gặp gián đoạn khi đồng bộ dữ liệu với dịch vụ phía sau, nên phản hồi hiện không ổn định.",
      eyebrow: "Service interruption",
      insights: [
        { label: "Nhóm lỗi", value: "Mất kết nối dịch vụ" },
        { label: "Tác động", value: "Dữ liệu có thể tải chậm hoặc không phản hồi" },
        { label: "Mã tham chiếu", value: reference },
      ],
      links: [
        { href: "/", label: "Về trang chủ", variant: "ghost" },
        { href: "/tracking", label: "Tra cứu đơn hàng", variant: "ghost" },
      ],
      primaryAction: { label: "Thử lại", variant: "default" },
      secondaryAction: { label: "Về trang chủ", href: "/", variant: "outline" },
      title: "Kết nối dịch vụ đang bị gián đoạn",
      tone: "sky",
    };
  }

  return {
    code: "500",
    checklist: [
      "Tải lại trang để xem lỗi chỉ là gián đoạn tạm thời hay không.",
      "Quay về tuyến điều hướng an toàn như trang chủ hoặc dashboard chính.",
      "Gửi mã tham chiếu cho đội kỹ thuật nếu sự cố lặp lại.",
    ],
    description:
      "Một lỗi không mong muốn vừa xảy ra trong quá trình xử lý. Ứng dụng đã chặn lỗi lại, nhưng trang này hiện chưa thể hiển thị đúng.",
    eyebrow: "System failure",
    insights: [
      { label: "Nhóm lỗi", value: "Lỗi hệ thống tổng quát" },
      { label: "Thông điệp", value: message || "Không có thêm chi tiết từ runtime" },
      { label: "Mã tham chiếu", value: reference },
    ],
    links: [
      { href: "/", label: "Về landing page", variant: "ghost" },
      { href: "/dashboard", label: "Mở dashboard", variant: "ghost" },
    ],
    primaryAction: { label: "Thử lại", variant: "default" },
    secondaryAction: { label: "Về trang chủ", href: "/", variant: "outline" },
    title: "Máy chủ vừa mất đồng bộ trong lúc xử lý yêu cầu",
    tone: "rose",
  };
}

export function getDashboardErrorContent(
  error: Error & { digest?: string },
): ErrorExperienceContent {
  const message = normalizeMessage(error.message);
  const reference = toReference(error.digest);

  if (isConfigurationError(message)) {
    return {
      code: "CFG",
      checklist: [
        "Xác minh endpoint backend và biến môi trường của dashboard.",
        "Kiểm tra service phụ trợ trước khi tải lại trang.",
        "Tạm quay về màn hình tổng quan nếu cần tiếp tục công việc.",
      ],
      description:
        "Module hiện tại chưa kết nối được nguồn dữ liệu cần thiết, thường do cấu hình môi trường hoặc endpoint chưa hoàn chỉnh.",
      eyebrow: "Dashboard configuration",
      insights: [
        { label: "Mức ảnh hưởng", value: "Module hiện tại không thể tải dữ liệu" },
        { label: "Loại lỗi", value: "Cấu hình / tích hợp" },
        { label: "Mã tham chiếu", value: reference },
      ],
      links: [
        { href: "/dashboard", label: "Về dashboard", variant: "ghost" },
        { href: "/", label: "Về landing page", variant: "ghost" },
      ],
      primaryAction: { label: "Thử tải lại module", variant: "default" },
      secondaryAction: { label: "Về dashboard", href: "/dashboard", variant: "outline" },
      title: "Bảng điều khiển chưa kết nối được dữ liệu vận hành",
      tone: "amber",
    };
  }

  if (isMissingResourceError(message)) {
    return {
      code: "404",
      checklist: [
        "Kiểm tra lại bộ lọc, mã đơn hoặc đường dẫn bạn vừa truy cập.",
        "Quay về danh sách tổng quan để chọn lại bản ghi hợp lệ.",
        "Nếu dữ liệu đã bị xóa, dùng tuyến điều hướng khác để tiếp tục thao tác.",
      ],
      description:
        "Dữ liệu hoặc module bạn đang mở không còn khả dụng tại thời điểm này, nên hệ thống không thể dựng màn hình chi tiết.",
      eyebrow: "Resource unavailable",
      insights: [
        { label: "Mức ảnh hưởng", value: "Không thể hiển thị dữ liệu yêu cầu" },
        { label: "Loại lỗi", value: "Thiếu bản ghi hoặc tuyến truy cập" },
        { label: "Mã tham chiếu", value: reference },
      ],
      links: [
        { href: "/dashboard", label: "Về dashboard", variant: "ghost" },
        { href: "/orders", label: "Xem đơn hàng", variant: "ghost" },
      ],
      primaryAction: { label: "Về dashboard", href: "/dashboard", variant: "default" },
      secondaryAction: { label: "Mở danh sách đơn", href: "/orders", variant: "outline" },
      title: "Bản ghi bạn cần không còn khả dụng trong hệ thống",
      tone: "sky",
    };
  }

  if (isNetworkError(message)) {
    return {
      code: "SYNC",
      checklist: [
        "Tải lại module để đồng bộ lại với API hoặc websocket.",
        "Kiểm tra backend hoặc kết nối mạng nếu lỗi xuất hiện hàng loạt.",
        "Quay về dashboard chính để tiếp tục các tác vụ không bị ảnh hưởng.",
      ],
      description:
        "Luồng dữ liệu vận hành giữa giao diện và dịch vụ nền đang bị gián đoạn, nên màn hình này chưa thể cập nhật chính xác.",
      eyebrow: "Operational sync issue",
      insights: [
        { label: "Mức ảnh hưởng", value: "Dữ liệu thời gian thực có thể lỗi thời hoặc trống" },
        { label: "Loại lỗi", value: "Mất kết nối / timeout" },
        { label: "Mã tham chiếu", value: reference },
      ],
      links: [
        { href: "/dashboard", label: "Về dashboard", variant: "ghost" },
        { href: "/notifications", label: "Xem thông báo", variant: "ghost" },
      ],
      primaryAction: { label: "Thử đồng bộ lại", variant: "default" },
      secondaryAction: { label: "Về dashboard", href: "/dashboard", variant: "outline" },
      title: "Luồng dữ liệu dashboard đang bị gián đoạn",
      tone: "sky",
    };
  }

  return {
    code: "OPS",
    checklist: [
      "Tải lại màn hình để thử khôi phục phiên làm việc hiện tại.",
      "Quay về dashboard tổng quan nếu bạn cần thao tác tiếp ngay.",
      "Gửi mã tham chiếu cùng thời điểm phát sinh lỗi cho đội kỹ thuật.",
    ],
    description:
      "Module quản trị vừa gặp lỗi xử lý ngoài dự kiến. Hệ thống đã dừng màn hình này để tránh hiển thị dữ liệu sai hoặc không đầy đủ.",
    eyebrow: "Operations fallback",
    insights: [
      { label: "Mức ảnh hưởng", value: "Chỉ ảnh hưởng module đang mở" },
      { label: "Thông điệp", value: message || "Chưa có thông điệp chi tiết" },
      { label: "Mã tham chiếu", value: reference },
    ],
    links: [
      { href: "/dashboard", label: "Về dashboard", variant: "ghost" },
      { href: "/", label: "Mở landing page", variant: "ghost" },
    ],
    primaryAction: { label: "Thử tải lại module", variant: "default" },
    secondaryAction: { label: "Về dashboard", href: "/dashboard", variant: "outline" },
    title: "Màn hình vận hành này tạm thời không thể dựng đúng dữ liệu",
    tone: "rose",
  };
}
