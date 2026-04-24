import ErrorExperience from "@/components/ui/error-experience";

export default function NotFound() {
  return (
    <ErrorExperience
      content={{
        code: "404",
        checklist: [
          "Kiểm tra lại URL hoặc thử quay về tuyến điều hướng gần nhất.",
          "Nếu bạn đi từ một liên kết cũ, nội dung có thể đã được đổi hoặc gỡ bỏ.",
          "Dùng một điểm bắt đầu an toàn như trang chủ, đăng nhập hoặc tra cứu đơn hàng.",
        ],
        description:
          "Trang bạn đang tìm không còn ở vị trí này hoặc chưa từng được xuất bản. Chúng tôi giữ lại cho bạn các lối đi ngắn nhất để quay lại đúng luồng.",
        eyebrow: "Page not found",
        insights: [
          { label: "Trạng thái", value: "Đường dẫn không tồn tại" },
          { label: "Mức ảnh hưởng", value: "Chỉ ảnh hưởng URL hiện tại" },
          { label: "Khôi phục", value: "Có thể tiếp tục qua các tuyến an toàn bên dưới" },
        ],
        links: [
          { href: "/", label: "Trang chủ", variant: "ghost" },
          { href: "/auth/login", label: "Đăng nhập", variant: "ghost" },
          { href: "/tracking", label: "Tra cứu đơn", variant: "ghost" },
        ],
        primaryAction: { label: "Về trang chủ", href: "/", variant: "default" },
        secondaryAction: { label: "Đăng nhập hệ thống", href: "/auth/login", variant: "outline" },
        title: "Trang này đã rời khỏi tuyến đường bạn vừa đi",
        tone: "emerald",
      }}
    />
  );
}
