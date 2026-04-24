export const appMetadata = {
  title: "Nền tảng logistics thông minh",
  description:
    "Giao diện logistics thông minh cho theo dõi đơn hàng, vận hành đội xe và điều phối bền vững.",
} as const;

export const navbarCopy = {
  brand: "Emerald Logistics",
  contactLabel: "Hệ thống",
  loginLabel: "Đăng nhập",
  registerLabel: "Đăng ký",
  menuLabel: "Menu",
  navItems: [
    { href: "#features", label: "Tính năng" },
    { href: "#solutions", label: "Giải pháp" },
    { href: "/tracking", label: "Tra cứu đơn hàng" },
    { href: "#sustainability", label: "Bền vững" },
  ],
} as const;

export const footerCopy = {
  brand: "Emerald Logistics",
  copyright: "© 2026 Emerald Logistics. Chính xác trong từng nhịp vận hành.",
  links: [
    { href: "#", label: "Chính sách bảo mật" },
    { href: "#", label: "Điều khoản dịch vụ" },
    { href: "#", label: "Báo cáo carbon" },
    { href: "#", label: "Mạng lưới toàn cầu" },
  ],
} as const;

export const operationsTopBarCopy = {
  brand: "Precision Logistics",
  items: [
    { href: "/dashboard/admin", id: "dashboard", label: "Bảng điều khiển" },
    { href: "/orders/create", id: "shipments", label: "Lô hàng" },
    { href: "/tracking", id: "tracking", label: "Theo dõi" },
  ],
} as const;
