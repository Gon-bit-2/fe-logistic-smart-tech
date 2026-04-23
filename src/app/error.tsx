"use client";

import { useEffect } from "react";
import ErrorExperience from "@/components/ui/error-experience";
import { getGlobalErrorContent } from "@/lib/error-experience";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  const content = getGlobalErrorContent(error);

  return <ErrorExperience content={content} onPrimaryAction={reset} />;
}
