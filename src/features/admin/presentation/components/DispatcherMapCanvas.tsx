import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { cn } from "@/lib/utils";

export interface DispatcherMapCanvasProps {
  readonly className?: string;
}

export default function DispatcherMapCanvas({
  className,
}: Readonly<DispatcherMapCanvasProps>) {
  const { data: fleetData, isLoading: isFleetLoading } = useFleetVehiclesQuery({ isActive: true });
  const { data: orderData, isLoading: isOrderLoading } = useOrdersListQuery({ status: "PENDING" });

  const isLoading = isFleetLoading || isOrderLoading;
  const totalVehicles = fleetData?.totalItems || fleetData?.data?.length || 0;
  const pendingOrders = orderData?.totalItems || orderData?.data?.length || 0;

  return (
    <div
      className={cn(
        "min-h-[18rem] rounded-[1rem] bg-surface-container-lowest p-6 shadow-[0_24px_48px_-24px_rgba(6,78,59,0.16)] flex flex-col items-center justify-center relative overflow-hidden md:min-h-[21rem] xl:min-h-[24rem]",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#064e3b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
      
      <div className="z-10 text-center max-w-md">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <h3 className="text-2xl font-black text-on-surface mb-2">Trung tâm Điều phối</h3>
        <p className="text-on-surface-variant mb-8">Bản đồ thời gian thực đang được phát triển. Dưới đây là tóm tắt trạng thái hoạt động hiện tại.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl text-center">
            <p className="text-sm font-semibold text-on-surface-variant mb-1">Đơn chờ phân bổ</p>
            <p className="text-3xl font-black text-primary">{isLoading ? "..." : pendingOrders}</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl text-center">
            <p className="text-sm font-semibold text-on-surface-variant mb-1">Xe sẵn sàng</p>
            <p className="text-3xl font-black text-green-600">{isLoading ? "..." : totalVehicles}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
