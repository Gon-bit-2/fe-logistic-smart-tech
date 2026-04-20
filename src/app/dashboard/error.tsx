"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/data-states";

export default function DashboardError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Dashboard Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <ErrorState
          title="Lỗi tải dữ liệu bảng điều khiển"
          description={error.message || "Không thể tải dữ liệu cho trang này. Vui lòng thử lại."}
          action={
            <Button onClick={() => reset()} variant="outline">
              Thử lại
            </Button>
          }
        />
      </div>
    </div>
  );
}
