"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/data-states";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <ErrorState
        title="Đã xảy ra lỗi hệ thống"
        description={error.message || "Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau."}
        action={
          <Button onClick={() => reset()} variant="default">
            Thử lại
          </Button>
        }
      />
    </div>
  );
}
