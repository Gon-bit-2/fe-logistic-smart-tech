import Link from "next/link";

type OperationsTopBarProps = Readonly<{
  active?: "dashboard" | "shipments" | "tracking";
}>;

const items = [
  { id: "dashboard", href: "/dashboard/admin", label: "Dashboard" },
  { id: "shipments", href: "/orders/create", label: "Shipments" },
  { id: "tracking", href: "/tracking", label: "Tracking" },
] as const;

export default function OperationsTopBar({
  active = "shipments",
}: OperationsTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-emerald-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-emerald-900"
          >
            Precision Logistics
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`pb-1 text-sm font-medium tracking-tight transition-colors ${
                  active === item.id
                    ? "border-b-2 border-emerald-600 text-emerald-950"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full p-2 text-slate-700 transition hover:bg-emerald-100/70"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-slate-700 transition hover:bg-emerald-100/70"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-primary-container bg-emerald-200">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr-t0qCmrp6_R_f8FcP-WFCh-7DTEOqwrUUnajkyofTG5tjqTMcwR-fKmIsuD1TFc0xp3WtZ-YDnxmNdFkrHTbmMG8jYUREuR70UJjMzqT_2NC0Yrm_lnhiS5VW3aBiyHwNpYaBzw1H8Fv_QCxF5nwRkFg35JOsEmhe080OAzcRZ8IBHqseK7UODesoRd5p8cJKk-pQQaHwKeYDB7tn5DftiRz19jYFWyuOFzKfrCkeCGQdBYBM2gRcaDTCw7OA1rceab6Tv_--wRG"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
