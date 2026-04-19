import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/data-states";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <EmptyState
        title="404 - Không tìm thấy trang"
        description="Trang bạn đang cố gắng truy cập không tồn tại hoặc đã bị gỡ bỏ."
        action={
          <Button asChild variant="default">
            <Link href="/">Về trang chủ</Link>
          </Button>
        }
      />
    </div>
  );
}
