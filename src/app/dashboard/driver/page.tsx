import { PageHeader, MetricCard, SectionCard } from "@/features/admin/presentation/components/admin-primitives";
import { Route, CheckCircle, Clock, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DriverPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="TỔNG QUAN"
        title="Không gian Tài xế"
        description="Theo dõi hiệu suất làm việc, tình trạng xe và các chuyến đi sắp tới của bạn."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="CHUYẾN ĐÃ HOÀN THÀNH"
          value="128"
          detail="Tăng 12% so với tháng trước"
          icon={<CheckCircle className="size-6" />}
          trend={{ label: "+12%", tone: "positive" }}
          accent="green"
        />
        <MetricCard
          label="TỔNG GIỜ LÁI (TUẦN)"
          value="42h 15m"
          detail="Nằm trong giới hạn an toàn"
          icon={<Clock className="size-6" />}
          accent="blue"
        />
        <MetricCard
          label="ĐIỂM ĐÁNH GIÁ"
          value="4.9 / 5.0"
          detail="Dựa trên 115 chuyến gần nhất"
          icon={<Route className="size-6" />}
          accent="dark"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard className="p-8">
          <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Trạng thái xe hiện tại
            </h2>
            <Truck className="size-6 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center rounded-xl bg-slate-50 p-4">
              <span className="text-sm font-semibold text-slate-500">Biển số</span>
              <span className="font-bold text-slate-900">29C - 123.45</span>
            </div>
            <div className="flex justify-between items-center rounded-xl bg-slate-50 p-4">
              <span className="text-sm font-semibold text-slate-500">Mức nhiên liệu</span>
              <span className="font-bold text-slate-900">75%</span>
            </div>
            <div className="flex justify-between items-center rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
              <span className="text-sm font-semibold text-emerald-700">Tình trạng chung</span>
              <span className="font-bold text-emerald-700 uppercase tracking-wide text-sm">Hoạt động tốt</span>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline" className="w-full font-bold">
              <Link href="/dashboard/driver/vehicle">Chi tiết phương tiện</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard className="p-8">
          <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Chuyến đi đang nhận
            </h2>
            <Route className="size-6 text-tertiary" />
          </div>
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">Hiện tại bạn chưa nhận chuyến đi nào.</p>
            <Button asChild className="mt-4 font-bold shadow-md shadow-primary/20">
              <Link href="/dashboard/driver/trips">Xem danh sách chuyến</Link>
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
