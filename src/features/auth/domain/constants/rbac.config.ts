import { UserRole } from "@/features/auth/domain/types/auth.types";

export const ROUTE_PERMISSIONS = {
  ADMIN: ["admin"] as UserRole[],
  DRIVER: ["admin", "driver"] as UserRole[],
  WAREHOUSE: ["admin", "warehouse_staff"] as UserRole[],
  CUSTOMER: ["admin", "customer", "driver", "warehouse_staff"] as UserRole[],
};
