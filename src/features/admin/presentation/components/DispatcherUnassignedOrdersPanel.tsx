import { EmptyState, ErrorState, LoadingState } from "@/components/ui/data-states";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { cn } from "@/lib/utils";

export interface DispatcherUnassignedOrdersPanelProps {
  readonly className?: string;
}

export default function DispatcherUnassignedOrdersPanel({
  className,
}: Readonly<DispatcherUnassignedOrdersPanelProps>) {
  const { data, isLoading, isError, error, refetch } = useOrdersListQuery({ status: "PENDING" });

  return (
    <div
      className={cn(
        "rounded-[1rem] bg-surface-container-lowest p-6 shadow-[0_24px_48px_-24px_rgba(6,78,59,0.16)] flex flex-col h-full",
        className,
      )}
    >
      <h3 className="mb-4 text-lg font-black text-on-surface">Đơn hàng chưa gán</h3>
      <div className="flex-1 overflow-y-auto">
        {isLoading && <LoadingState title="Đang tải..." description="Đang tải danh sách đơn hàng" />}
        {isError && (
          <ErrorState 
            title="Lỗi tải dữ liệu" 
            description={error?.message || "Không thể tải đơn hàng"} 
            action={<button onClick={() => void refetch()} className="text-primary underline">Thử lại</button>} 
          />
        )}
        {!isLoading && !isError && (!data?.data || data.data.length === 0) && (
          <EmptyState title="Không có đơn hàng" description="Tất cả đơn hàng đã được phân bổ" />
        )}
        {!isLoading && !isError && data?.data && data.data.length > 0 && (
          <ul className="space-y-3">
            {data.data.map((order) => (
              <li key={order.id} className="rounded-lg border border-outline-variant/20 p-3 hover:bg-surface-container-low/50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-sm font-bold text-primary">{order.reference}</span>
                  <span className="text-xs font-semibold bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
                    {order.serviceTier === "express" ? "Express" : order.serviceTier === "eco_green" ? "Eco" : "Standard"}
                  </span>
                </div>
                <p className="text-sm font-medium text-on-surface truncate">{order.deliveryAddress}</p>
                <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
                  <span>Trọng lượng: {order.packageWeightKg ? `${order.packageWeightKg} kg` : "N/A"}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
