import type { ReactNode } from "react";
import CustomerTopBar from "@/components/layout/CustomerTopBar";

export default function CustomerShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <CustomerTopBar />
      <div className="pb-10">{children}</div>
    </div>
  );
}
