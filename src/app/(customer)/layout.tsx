import type { ReactNode } from "react";
import CustomerShell from "@/components/layout/CustomerShell";

export default function CustomerRoutesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <CustomerShell>{children}</CustomerShell>;
}
