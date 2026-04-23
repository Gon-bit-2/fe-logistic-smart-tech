"use client";

import { useEffect } from "react";
import ErrorExperience from "@/components/ui/error-experience";
import { getDashboardErrorContent } from "@/lib/error-experience";

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

  const content = getDashboardErrorContent(error);

  return <ErrorExperience compact content={content} onPrimaryAction={reset} />;
}
