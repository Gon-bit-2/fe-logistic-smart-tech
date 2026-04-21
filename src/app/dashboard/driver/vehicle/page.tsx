import { PageHeader, SectionCard, MetricCard } from "@/features/admin/presentation/components/admin-primitives";
import { Wrench, AlertTriangle, Fingerprint, Droplets, BatteryCharging, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DriverVehiclePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="PHƯƠNG TIỆN"
        title="Quản Lý Phương Tiện"
        description="Xem thông tin xe đang nhận, báo cáo hỏng hóc hoặc khai báo chi phí nhiên liệu."
        actions={
          <Button className="h-12 rounded-2xl bg-amber-500 font-bold hover:bg-amber-600">
            <AlertTriangle className="mr-2 size-5" />
            Báo Sự Cố
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          label="BIỂN SỐ HIỆN TẠI"
          value="29C - 123.45"
          detail="Loại: Tải thùng 5 Tấn"
          icon={<Fingerprint className="size-6" />}
          accent="dark"
        />
        <MetricCard
          label="MỨC NHIÊN LIỆU"
          value="75%"
          detail="Cập nhật 2 giờ trước"
          icon={<Droplets className="size-6" />}
          accent="blue"
        />
        <MetricCard
          label="TRẠNG THÁI BẢO DƯỠNG"
          value="Tốt"
          detail="Kỳ bảo dưỡng: 12/05/2026"
          icon={<BatteryCharging className="size-6" />}
          accent="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard className="p-8">
          <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Công cụ phương tiện
            </h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <button className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md">
              <div className="rounded-xl bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110">
                <FileText className="size-8" />
              </div>
              <span className="font-bold text-slate-700">Khai báo chi phí</span>
            </button>
            
            <button className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md">
              <div className="rounded-xl bg-amber-500/10 p-4 text-amber-500 transition-transform group-hover:scale-110">
                <Wrench className="size-8" />
              </div>
              <span className="font-bold text-slate-700">Yêu cầu sửa chữa</span>
            </button>
          </div>
        </SectionCard>

        <SectionCard className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center bg-slate-50/50">
          <div className="mb-4 flex size-20 items-center justify-center rounded-3xl bg-slate-200/50 text-slate-400">
            <Wrench className="size-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Tính năng Đang Phát Triển
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            Biểu mẫu báo cáo chi tiết sự cố phương tiện và tải lên hóa đơn đổ xăng, thu phí đang được xây dựng.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
