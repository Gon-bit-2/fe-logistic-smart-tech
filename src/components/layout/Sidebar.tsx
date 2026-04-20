import Link from "next/link";

type SidebarItem = {
  href: string;
  label: string;
};

type SidebarProps = {
  title?: string;
  items?: SidebarItem[];
};

const defaultItems: SidebarItem[] = [
  { href: "/dashboard/admin", label: "Tổng quan quản trị" },
  { href: "/dashboard/driver", label: "Không gian tài xế" },
  { href: "/orders/create", label: "Tạo đơn hàng" },
  { href: "/tracking/PL-882-990-21", label: "Theo dõi trực tiếp" },
];

export default function Sidebar({
  title = "Trung tâm vận hành",
  items = defaultItems,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-full max-w-xs flex-col border-r border-border bg-surface-container-low px-5 py-6">
      <div className="mb-8">
        <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
          Điều hướng
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {title}
        </h2>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-white hover:text-on-surface"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-on-surface-variant">
        Các khu vực đăng nhập, đơn hàng, đội xe, theo dõi và vận hành xanh đã
        sẵn sàng để sử dụng.
      </div>
    </aside>
  );
}
