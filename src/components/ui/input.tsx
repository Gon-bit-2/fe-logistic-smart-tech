import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-lg border border-transparent bg-transparent px-0 text-sm text-on-surface placeholder:text-on-surface-variant/55 transition outline-none",
        "focus:border-primary focus:bg-surface-container-lowest focus:px-3 focus:ring-4 focus:ring-primary/8",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
